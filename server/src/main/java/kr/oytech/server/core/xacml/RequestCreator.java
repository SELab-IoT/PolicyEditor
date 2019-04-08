package kr.oytech.server.core.xacml;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.wso2.balana.XACMLConstants;
import org.wso2.balana.attr.StringAttribute;
import org.wso2.balana.attr.TimeAttribute;
import org.wso2.balana.ctx.Attribute;
import org.wso2.balana.ctx.xacml2.Subject;
import org.wso2.balana.ctx.xacml3.RequestCtx;
import org.wso2.balana.xacml3.Attributes;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

@Component
public class RequestCreator {
    /*
        {"subject": "Father", "action": "open", "resource": "car", "current_time": {"type" : "time", "value": "18:00"}}
     */
    public RequestCtx parse(JsonNode jsonNode) throws URISyntaxException, ParseException {
        Iterator<Map.Entry<String, JsonNode>> iterator = jsonNode.fields();
        HashSet<Attributes> attributesHashSet = new HashSet<>();

        while (iterator.hasNext()) {
            Map.Entry<String, JsonNode> entry = iterator.next();
            switch (entry.getKey()) {
                case "subject":
                    String subject = entry.getValue().asText();
                    Attribute subjectAttribute = new Attribute(new URI("urn:oasis:names:tc:xacml:1.0:subject:subject-id"), null, null, new StringAttribute(subject), XACMLConstants.XACML_VERSION_3_0);
                    attributesHashSet.add(new Attributes(Subject.DEFAULT_CATEGORY, Set.of(subjectAttribute)));
                    break;
                case "resource":
                    String resource = entry.getValue().asText();
                    Attribute resourceAttribute = new Attribute(new URI("urn:oasis:names:tc:xacml:1.0:resource:resource-id"), null, null, new StringAttribute(resource), XACMLConstants.XACML_VERSION_3_0);
                    attributesHashSet.add(new Attributes(new URI("urn:oasis:names:tc:xacml:3.0:attribute-category:resource"), Set.of(resourceAttribute)));
                    break;
                case "action":
                    String action = entry.getValue().asText();
                    Attribute actionAttribute = new Attribute(new URI("urn:oasis:names:tc:xacml:1.0:action:action-id"), null, null, new StringAttribute(action), XACMLConstants.XACML_VERSION_3_0);
                    attributesHashSet.add(new Attributes(new URI("urn:oasis:names:tc:xacml:3.0:attribute-category:action"), Set.of(actionAttribute)));
                    break;
                default:
                    String key = entry.getKey();
                    JsonNode valueNode = entry.getValue();
                    String type = valueNode.get("type").asText();
                    String value = valueNode.get("value").asText();
                    switch (type) {
                        case "time":
                            SimpleDateFormat format = new SimpleDateFormat("hh:mm");
                            Attribute customAttribute = new Attribute(new URI(key), null, null, new TimeAttribute(format.parse(value)), XACMLConstants.XACML_VERSION_3_0);
                            attributesHashSet.add(new Attributes(new URI(type), Set.of(customAttribute)));
                            break;
                        case "integer":
                        case "string":
                    }
            }
        }
        System.out.println(attributesHashSet.toString());

        RequestCtx requestCtx = new RequestCtx(null, attributesHashSet, true, true, null, null);
        return requestCtx;
    }
}
