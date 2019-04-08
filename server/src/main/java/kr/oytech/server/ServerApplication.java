package kr.oytech.server;

import kr.oytech.server.handler.XACMLConvertHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@SpringBootApplication
public class ServerApplication {

    @Bean
    public RouterFunction<ServerResponse> routes(XACMLConvertHandler xacmlConvertHandler) {
        return route()
                .POST("/convert", xacmlConvertHandler::parseXACML)
                .POST("/request", xacmlConvertHandler::parseRequest)
                .POST("/check", xacmlConvertHandler::findMatchPolicy)
                .build();
    }

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

}
