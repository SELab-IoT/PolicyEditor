package kr.oytech.server.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.oytech.server.core.xacml.PolicyCreator;
import kr.oytech.server.core.xacml.RequestCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.wso2.balana.PDPConfig;
import org.wso2.balana.ParsingException;
import org.wso2.balana.Policy;
import org.wso2.balana.ctx.AbstractResult;
import org.wso2.balana.ctx.EvaluationCtx;
import org.wso2.balana.ctx.EvaluationCtxFactory;
import org.wso2.balana.ctx.xacml3.RequestCtx;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component
public class PolicyTestHandler {

    PolicyCreator policyCreator;
    RequestCreator requestCreator;
    ObjectMapper objectMapper;

    public static final int DECISION_PERMIT = 0;

    /**
     * The decision to deny the request
     */
    public static final int DECISION_DENY = 1;

    /**
     * The decision that a decision about the request cannot be made
     */
    public static final int DECISION_INDETERMINATE = 2;

    /**
     * The decision that nothing applied to us
     */
    public static final int DECISION_NOT_APPLICABLE = 3;

    /**
     * The decision that a decision about the request cannot be made
     */
    public static final int DECISION_INDETERMINATE_DENY = 4;

    /**
     * The decision that a decision about the request cannot be made
     */
    public static final int DECISION_INDETERMINATE_PERMIT = 5;

    /**
     * The decision that a decision about the request cannot be made
     */
    public static final int DECISION_INDETERMINATE_DENY_OR_PERMIT = 6;

    /**
     * string versions of the 4 Decision types used for encoding
     */
    public static final String[] DECISIONS = { "Permit", "Deny", "Indeterminate", "NotApplicable"};

    @Autowired
    public PolicyTestHandler(PolicyCreator policyCreator, RequestCreator requestCreator, ObjectMapper objectMapper) {
        this.policyCreator = policyCreator;
        this.requestCreator = requestCreator;
        this.objectMapper = objectMapper;
    }

    public Mono<ServerResponse> testPolicy(ServerRequest request) {
        return request.bodyToMono(String.class)
                .map(json -> {
                    try {
                        return objectMapper.readTree(json);
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .map(jsonNode -> {
                    JsonNode policyJson = jsonNode.get("policy");
                    JsonNode requestJson = jsonNode.get("data");
                    try {
                        List<Policy> policyList = policyCreator.test(policyJson);
                        Iterator<Map.Entry<String, JsonNode>> requests = requestJson.fields();
                        Map<String, Map<String, String>> decisionMap = new HashMap<>();
                        while(requests.hasNext()) {
                            Map.Entry<String, JsonNode> r = requests.next();
                            String key = r.getKey();
                            RequestCtx requestCtx = requestCreator.parse(r.getValue());

                            EvaluationCtx evaluationCtx = EvaluationCtxFactory.getFactory().getEvaluationCtx(requestCtx, new PDPConfig(null, null, null));
                            Map<String, String> map = new HashMap<>();

                            policyList.forEach(policy -> {
                                AbstractResult result = policy.evaluate(evaluationCtx);
                                System.out.println(result.encode());
                                int decision = result.getDecision();
                                if (decision > 3)
                                    decision = 3;
                                map.put(policy.getId().toString(),PolicyTestHandler.DECISIONS[decision]);
                            });
                            decisionMap.put(key, map);
                        }
                        return decisionMap;
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                        return null;
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return null;
                    } catch (ParsingException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .flatMap(s -> ServerResponse.ok().syncBody(s));
    }
}
