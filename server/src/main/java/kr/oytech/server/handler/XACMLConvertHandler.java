package kr.oytech.server.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.oytech.server.core.xacml.PolicyCreator;
import kr.oytech.server.core.xacml.RequestCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.wso2.balana.Indenter;
import org.wso2.balana.MatchResult;
import org.wso2.balana.PDPConfig;
import org.wso2.balana.Policy;
import org.wso2.balana.ctx.xacml3.XACML3EvaluationCtx;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.*;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Component
public class XACMLConvertHandler {

    PolicyCreator policyCreator;
    RequestCreator requestCreator;
    List<Policy> policies  = Collections.synchronizedList(new LinkedList<>());

    @Autowired
    public XACMLConvertHandler(PolicyCreator policyCreator, RequestCreator requestCreator) {
        this.policyCreator = policyCreator;
        this.requestCreator = requestCreator;
    }

    public Mono<ServerResponse> parseXACML(ServerRequest request) {
        return request.bodyToMono(String.class)
                .map(json -> {
                    try {
                        return new ObjectMapper().readTree(json);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                }).map(jsonNode -> {
                    try {
                        return policyCreator.test(jsonNode);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                        return null;
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return null;
                    }
                }).flatMap(policy -> {
                    this.policies = new LinkedList<>();
                    List<Policy> policyList = Optional.ofNullable(policy).orElseThrow();
                    this.policies.addAll(policyList);
                    policyList.forEach(policy1 -> {
                        File f = new File(policy1.getId() + ".xml");
                        PrintWriter printWriter = null;
                        try {
                            printWriter = new PrintWriter(f);
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        }

                        printWriter.println(policy1.encode());
                        printWriter.close();

                    });

                    DataBuffer buffer = new DefaultDataBufferFactory().wrap(policyList.get(0).encode().getBytes());

                    return ServerResponse.ok()
                            .header("Content-Disposition", "attachment;filename=policy.xml")
                            .contentType(MediaType.APPLICATION_OCTET_STREAM)
                            .body(BodyInserters.fromDataBuffers(Flux.just(buffer)));
                });

    }

    /*
    {"subject": "Father", "action": "open", "resource": "car", "current_time": "18:00"}
     */
    public Mono<ServerResponse> parseRequest(ServerRequest request) {
        return request.bodyToMono(String.class)
                .map(jsonString -> {
                    try {
                        return new ObjectMapper().readTree(jsonString);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                }).map(jsonNode -> {
                    try {
                        return requestCreator.parse(jsonNode);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                        return null;
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return null;
                    }
                }).flatMap(requestCtx -> {
                    OutputStream outputStream = new OutputStream() {
                        StringBuilder builder = new StringBuilder();

                        @Override
                        public void write(int b) {
                            builder.append((char) b);
                        }

                        @Override
                        public String toString() {
                            return builder.toString();
                        }
                    };
                    requestCtx.encode(outputStream, new Indenter(4));
                    return ServerResponse.ok()
                            .syncBody(outputStream.toString());
                });
    }

    public Mono<ServerResponse> findMatchPolicy(ServerRequest request) {
        List<Policy> matchedPolicies = new LinkedList<>();

        return request.bodyToMono(String.class)
                .map(jsonString -> {
                    try {
                        return new ObjectMapper().readTree(jsonString);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                }).map(jsonNode -> {
                    policies.forEach(policy -> {
                        try {
                            MatchResult matchResult = policy.getTarget().match(new XACML3EvaluationCtx(requestCreator.parse(jsonNode),  new PDPConfig(null, null, null)));
                            if (matchResult.getResult() == MatchResult.MATCH) {
                                matchedPolicies.add(policy);
                            }
                        } catch (URISyntaxException e) {
                            e.printStackTrace();
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                    });
                    return policyCreator.toJson(matchedPolicies);
                }).flatMap(s -> ServerResponse.ok().syncBody(s));
    }
}
