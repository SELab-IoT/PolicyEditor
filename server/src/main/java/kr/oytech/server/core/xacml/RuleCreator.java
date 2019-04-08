package kr.oytech.server.core.xacml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.wso2.balana.Rule;
import org.wso2.balana.XACMLConstants;
import org.wso2.balana.attr.IntegerAttribute;
import org.wso2.balana.attr.StringAttribute;
import org.wso2.balana.attr.TimeAttribute;
import org.wso2.balana.attr.xacml3.AttributeDesignator;
import org.wso2.balana.cond.*;
import org.wso2.balana.ctx.xacml2.Result;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class RuleCreator {

    /*
    {
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
    {
        "rules":
            [
                {
                    "name": "rule1",
                    "effect": true,
                    "condition" : {
                        "apply": {
                            "function": "and",
                            "type": "boolean",
                            "value": {
                                "first": {
                                    "function": "greater",
                                    "type": "time",
                                    "value": "15:00"
                                },
                                "second": {
                                    "function": "less",
                                    "type": "time",
                                    "value": "20:00"
                                }
                            }

                        }
                    }
                }
            ]
    }
     */
    public List<Rule> parseRules(JsonNode jsonNode) throws URISyntaxException, ParseException {
        JsonNode rules = jsonNode.get("rules");
        Iterator<JsonNode> ruleIterator = rules.iterator();
        List<Rule> ruleList = new LinkedList<>();

        while (ruleIterator.hasNext()) {
            JsonNode r = ruleIterator.next();
            Rule rule = parseRule(r);
            ruleList.add(rule);
        }
        return ruleList;
    }

    private Rule parseRule(JsonNode r) throws URISyntaxException, ParseException {
        String ruleName = r.get("name").asText();
        boolean effect = r.get("effect").asBoolean();
        int ruleEffect = effect ? Result.DECISION_PERMIT : Result.DECISION_DENY;
        Rule rule = parseExpression(ruleName, ruleEffect, r.get("condition"));
        return rule;
    }

    private Rule parseExpression(String ruleName, int effect, JsonNode r) throws URISyntaxException, ParseException {
        JsonNode applyNode = r.get("apply");
        Expression expression = parseApply(applyNode);
        Condition condition = new Condition(expression);

        return new Rule(new URI(ruleName), effect, null, null, condition, null, null, XACMLConstants.XACML_VERSION_3_0);

    }

    //TODO: composition으로 만들어야됨 apply -> {apply, apply}
    private Expression parseApply(JsonNode r) throws ParseException, URISyntaxException {
        String functionType = r.get("function").asText();
        String valueType = r.get("type").asText();
        JsonNode valueNode = r.get("value");
        Function function = null;
        List<Expression> xprs = new LinkedList<>();
        String inputId = null;

        switch (functionType) {
            case "and":
                function = new LogicalFunction(LogicalFunction.NAME_AND);
                xprs.add(parseApply(valueNode.get("first")));
                xprs.add(parseApply(valueNode.get("second")));
                break;
            case "equal":
                inputId = r.get("inputId").asText();
                switch (valueType) {
                    case "integer":
                        function = new EqualFunction(EqualFunction.NAME_INTEGER_EQUAL);
                        parseFunctionParameter(inputId, valueType, valueNode.asText(), xprs);
                        break;
                    case "string":
                        function = new EqualFunction(EqualFunction.NAME_STRING_EQUAL);
                        parseFunctionParameter(inputId, valueType, valueNode.asText(), xprs);
                        break;
                }
                break;
            case "greater":
                inputId = r.get("inputId").asText();
                switch (valueType) {
                    case "time":
                        function = new ComparisonFunction(ComparisonFunction.NAME_TIME_GREATER_THAN);
                        parseFunctionParameter(inputId, valueType, valueNode.asText(), xprs);
                        break;
                    default:
                        function = new ComparisonFunction(ComparisonFunction.NAME_INTEGER_GREATER_THAN);
                        break;
                }
                break;
            case "less":
                inputId = r.get("inputId").asText();
                switch (valueType) {
                    case "time":
                        function = new ComparisonFunction(ComparisonFunction.NAME_TIME_LESS_THAN);
                        parseFunctionParameter(inputId, valueType, valueNode.asText(), xprs);
                        break;
                    default:
                        function = new ComparisonFunction(ComparisonFunction.NAME_INTEGER_LESS_THAN);
                        break;
                }
                break;
            default:
                inputId = r.get("inputId").asText();
                function = new EqualFunction(EqualFunction.NAME_STRING_EQUAL);
                parseFunctionParameter(inputId, valueType, valueNode.asText(), xprs);
                break;
        }

        Expression expression = new Apply(function, xprs);
        return expression;
    }

    private void parseFunctionParameter(String id, String valueType, String value, List<Expression> xprs) throws ParseException, URISyntaxException {
        switch (valueType) {
            case "time":
                SimpleDateFormat format = new SimpleDateFormat("hh:mm");
                xprs.add(new TimeAttribute(format.parse(value)));
                xprs.add(
                        new Apply(new GeneralBagFunction(FunctionBase.FUNCTION_NS + valueType + BagFunction.NAME_BASE_ONE_AND_ONLY),
                                List.of(new AttributeDesignator(new URI(TimeAttribute.identifier), new URI(id), false, new URI("time")))
                        )
                );
                break;
            case "string":
                xprs.add(new StringAttribute(value));
                xprs.add(
                        new Apply(new GeneralBagFunction(FunctionBase.FUNCTION_NS + valueType + BagFunction.NAME_BASE_ONE_AND_ONLY),
                                List.of(new AttributeDesignator(new URI(StringAttribute.identifier), new URI(id), false, new URI("string")))
                        )
                );
                break;
            case "integer":
                xprs.add(new IntegerAttribute(Integer.parseInt(value)));
                xprs.add(
                        new Apply(new GeneralBagFunction(FunctionBase.FUNCTION_NS + valueType + BagFunction.NAME_BASE_ONE_AND_ONLY),
                                List.of(new AttributeDesignator(new URI(IntegerAttribute.identifier), new URI(id), false, new URI("integer")))
                        )
                );
        }

    }

    public static void main(String[] args) throws IOException {
        RuleCreator creator = new RuleCreator();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(
                "{\n" +
                        "        \"rules\":\n" +
                        "            [\n" +
                        "                {\n" +
                        "                    \"name\": \"rule1\",\n" +
                        "                    \"effect\": true,\n" +
                        "                    \"condition\" : {\n" +
                        "                        \"apply\": {\n" +
                        "                            \"function\": \"and\",\n" +
                        "                            \"type\": \"boolean\",\n" +
                        "                            \"value\": {\n" +
                        "                                \"first\": {\n" +
                        "                                    \"function\": \"greater\",\n" +
                        "                                    \"type\": \"time\",\n" +
                        "                                    \"value\": \"15:00\"\n" +
                        "                                },\n" +
                        "                                \"second\": {\n" +
                        "                                    \"function\": \"less\",\n" +
                        "                                    \"type\": \"time\",\n" +
                        "                                    \"value\": \"20:00\"\n" +
                        "                                }\n" +
                        "                            }\n" +
                        "\n" +
                        "                        }\n" +
                        "                    }\n" +
                        "                }\n" +
                        "            ]\n" +
                        "    }"
        );
        try {
            List<Rule> rules = creator.parseRules(node);
            rules.forEach(r -> System.out.println(r.encode()));
//            System.out.println(target.encode());
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }
}
