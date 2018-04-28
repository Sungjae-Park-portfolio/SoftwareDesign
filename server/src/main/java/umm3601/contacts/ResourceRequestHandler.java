package umm3601.contacts;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ResourceRequestHandler {
    private final ResourceController resourceController;

    public ResourceRequestHandler(ResourceController resourceController) {
        this.resourceController = resourceController;
    }

    public String getResourceJSON(Request req, Response res) {
        res.type("application/json");
        String id = req.params("id");
        String resource;
        try {
            resource = resourceController.getItem(id);
        } catch (IllegalArgumentException e) {
            res.status(400);
            res.body("The requested resource id " + id + " wasn't a legal Mongo Object ID." +
                "\n See 'https://docs.mongodb.com/manual/reference/method/ObjectID/' for more information");
            return "";
        }
        if (resource != null) {
            return resource;
        }
        else {
            res.status(404);
            res.body("The requested resource with id " + id + " wasn't found");
            return "";
        }
    }

    public String getResources(Request req, Response res) {
        res.type("applications/json");
        return resourceController.getItems(req.queryMap().toMap());
    }

    public String addNewResource(Request req, Response res) {
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if (o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbObject = (BasicDBObject) o;
                    String phone = dbObject.getString("phone");
                    String email = dbObject.getString("email");
                    String resourceName = dbObject.getString("name");

                    System.out.println("Adding new resource with [resourceName=" + resourceName +
                        ", user email=" + email + ", and phone=" + phone + "]");
                    return resourceController.addNewResource(phone, email, resourceName);
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new Contact request failed.");
                    return null;
                }
            } else {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
            return null;
        }
    }
}
