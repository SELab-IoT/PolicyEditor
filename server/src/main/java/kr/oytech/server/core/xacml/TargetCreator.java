package kr.oytech.server.core.xacml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.wso2.balana.TargetMatch;
import org.wso2.balana.attr.StringAttribute;
import org.wso2.balana.attr.xacml3.AttributeDesignator;
import org.wso2.balana.cond.EqualFunction;
import org.wso2.balana.ctx.xacml2.Subject;
import org.wso2.balana.xacml3.AllOfSelection;
import org.wso2.balana.xacml3.AnyOfSelection;
import org.wso2.balana.xacml3.Target;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class TargetCreator {

    public Target parseTarget(JsonNode jsonNode) throws URISyntaxException {
        JsonNode t = jsonNode.get("target");
        Iterator<JsonNode> iterator = t.iterator();
        List<AnyOfSelection> anyOfSelectionList = new LinkedList<>();
        while(iterator.hasNext()) {
            JsonNode targetJson = iterator.next();
            JsonNode s = targetJson.get("subject");
            JsonNode r = targetJson.get("resource");
            JsonNode a = targetJson.get("action");

            List<AllOfSelection> allOfSelections = new LinkedList<>();
            if (s != null)
                buildAllOfSelection(s, allOfSelections);
            if (r != null)
                buildAllOfSelection(r, allOfSelections, TargetMatch.SUBJECT, "urn:oasis:names:tc:xacml:1.0:resource:resource-id", "urn:oasis:names:tc:xacml:3.0:attribute-category:resource");
            if (a != null)
                buildAllOfSelection(a, allOfSelections, TargetMatch.SUBJECT, "urn:oasis:names:tc:xacml:1.0:action:action-id", "urn:oasis:names:tc:xacml:3.0:attribute-category:action");

            anyOfSelectionList.add(new AnyOfSelection(allOfSelections));
        }

        return new Target(anyOfSelectionList);
    }

    private void buildAllOfSelection(JsonNode r, List<AllOfSelection> allOfSelections, int resource, String s2, String s3) throws URISyntaxException {
        Iterator<JsonNode> resourceIterator = r.iterator();
        List<TargetMatch> resourceTargetList = new LinkedList<>();
        while (resourceIterator.hasNext()) {
            String value = resourceIterator.next().asText();
            TargetMatch targetMatch = new TargetMatch(
                    resource,
                    EqualFunction.getEqualInstance(EqualFunction.NAME_STRING_EQUAL, StringAttribute.identifier),
                    new AttributeDesignator(new URI(StringAttribute.identifier), new URI(s2), true, new URI(s3)),
                    new StringAttribute(value)
            );
            resourceTargetList.add(targetMatch);
        }
        if (resourceTargetList.size() > 0) {
            allOfSelections.add(new AllOfSelection(resourceTargetList));
        }
    }

    private void buildAllOfSelection(JsonNode s, List<AllOfSelection> allOfSelections) throws URISyntaxException {
        Iterator<JsonNode> subjectIterator = s.iterator();
        List<TargetMatch> targetMatchList = new LinkedList<>();
        while(subjectIterator.hasNext()) {
            String value = subjectIterator.next().asText();
            TargetMatch targetMatch = new TargetMatch(TargetMatch.SUBJECT,
                    EqualFunction.getEqualInstance(EqualFunction.NAME_STRING_EQUAL, StringAttribute.identifier),
                    new AttributeDesignator(new URI(StringAttribute.identifier), new URI("urn:oasis:names:tc:xacml:1.0:subject:subject-id"), true, Subject.DEFAULT_CATEGORY),
                    new StringAttribute(value)
            );
            targetMatchList.add(targetMatch);
        }
        if (targetMatchList.size() > 0) {
            allOfSelections.add(new AllOfSelection(targetMatchList));
        }
    }

    public static void main(String[] args) throws IOException {
        TargetCreator creator = new TargetCreator();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(
                "{ \"target\": { \"subject\": [ \"father\" ], \"resource\": [ \"fridge\" ], \"action\": [ \"open\" ] } }");
        try {
            Target target = creator.parseTarget(node);
            System.out.println(target.encode());
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
}
