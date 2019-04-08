package kr.oytech.server.core.xacml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.stereotype.Component;
import org.wso2.balana.Policy;
import org.wso2.balana.Rule;
import org.wso2.balana.combine.CombiningAlgFactory;
import org.wso2.balana.combine.RuleCombiningAlgorithm;
import org.wso2.balana.combine.xacml3.DenyUnlessPermitRuleAlg;
import org.wso2.balana.combine.xacml3.PermitOverridesRuleAlg;
import org.wso2.balana.combine.xacml3.PermitUnlessDenyRuleAlg;
import org.wso2.balana.xacml3.Target;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.*;

@Component
public class PolicyCreator {

    private RuleCreator ruleCreator;
    private TargetCreator targetCreator;
    private Map<String, JsonNode> policyNodes = Collections.synchronizedMap(new HashMap<>());
    public PolicyCreator() {
        ruleCreator = new RuleCreator();
        targetCreator = new TargetCreator();
    }


    /*
    {
	"name": "policy1",

	"combineAlg": "permit-unless-deny",

	"target":
        {
            "subject": [
                "father"
            ],
            "resource": [
                "fridge"
            ],
            "action": [
                "open"
            ]
        },

    "rules":
            [
                {
                    "name": "rule1",
                    "effect": true,
                    "condition": {
                        "apply": {
                            "function": "greater",
                            "type": "time",
                            "value": "15:00"
                        }
                    }
                },
                {
                    "name": "rule2",
                    "effect": true,
                    "condition": {
                        "apply": {
                            "function": "less",
                            "type": "time",
                            "value": "20:00"
                        }
                    }
                }
            ]
}
     */
    public List<Policy> test(JsonNode jsonNode) throws URISyntaxException, ParseException {
        JsonNode policySetNode = jsonNode.get("policy");
        Iterator<JsonNode> iterator = policySetNode.iterator();
        List<Policy> policyList = new LinkedList<>();
        this.policyNodes.clear();
        while(iterator.hasNext()) {
            JsonNode policyNode = iterator.next();
            String name = policyNode.get("name").asText();
            policyNodes.put(name, policyNode);
            String ruleCombiningAlg = policyNode.get("combineAlg").asText();
            RuleCombiningAlgorithm ruleCombiningAlgorithm;
            switch (ruleCombiningAlg) {
                case "permit-unless-deny":
                    ruleCombiningAlgorithm = new PermitUnlessDenyRuleAlg();
                    break;
                case "deny-unless-permit":
                    ruleCombiningAlgorithm = new DenyUnlessPermitRuleAlg();
                    break;
                default:
                    ruleCombiningAlgorithm = new PermitOverridesRuleAlg();
                    break;
            }
            Target target = targetCreator.parseTarget(policyNode);
            List<Rule> ruleList = ruleCreator.parseRules(policyNode);
            Policy policy = new Policy(new URI(name), ruleCombiningAlgorithm, target, ruleList);
            policyList.add(policy);
        }
        return policyList;
    }

    public String toJson(List<Policy> matchedPolicies) {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode resultNode = mapper.createArrayNode();
        matchedPolicies.forEach(policy -> {

            if(this.policyNodes.containsKey(policy.getId().toString())) {
                JsonNode policyNode = this.policyNodes.get(policy.getId().toString());
                ((ArrayNode) resultNode).add(policyNode);
            }
        });

        return resultNode.toString();
    }

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(
                "{\n" +
                        "\t\"name\": \"policy1\",\n" +
                        "\n" +
                        "\t\"combineAlg\": \"permit-unless-deny\",\n" +
                        "\n" +
                        "\t\"target\":\n" +
                        "        {\n" +
                        "            \"subject\": [\n" +
                        "                \"father\"\n" +
                        "            ],\n" +
                        "            \"resource\": [\n" +
                        "                \"fridge\"\n" +
                        "            ],\n" +
                        "            \"action\": [\n" +
                        "                \"open\"\n" +
                        "            ]\n" +
                        "        },\n" +
                        "\n" +
                        "    \"rules\":\n" +
                        "            [\n" +
                        "                {\n" +
                        "                    \"name\": \"rule1\",\n" +
                        "                    \"effect\": true,\n" +
                        "                    \"condition\": {\n" +
                        "                        \"apply\": {\n" +
                        "                            \"function\": \"greater\",\n" +
                        "                            \"type\": \"time\",\n" +
                        "                            \"value\": \"15:00\"\n" +
                        "                        }\n" +
                        "                    }\n" +
                        "                },\n" +
                        "                {\n" +
                        "                    \"name\": \"rule2\",\n" +
                        "                    \"effect\": true,\n" +
                        "                    \"condition\": {\n" +
                        "                        \"apply\": {\n" +
                        "                            \"function\": \"less\",\n" +
                        "                            \"type\": \"time\",\n" +
                        "                            \"value\": \"20:00\"\n" +
                        "                        }\n" +
                        "                    }\n" +
                        "                }\n" +
                        "            ]\n" +
                        "}"
        );
        PolicyCreator policyCreator = new PolicyCreator();
        try {
            policyCreator.test(node);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }


}
