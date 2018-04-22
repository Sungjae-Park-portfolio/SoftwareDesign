package umm3601.contacts;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ContactRequestHandler {
    private final ContactController contactController;

    public ContactRequestHandler(ContactController contactController) {
        this.contactController = contactController;
    }

    public String getContactJSON(Request req, Response res) {
        res.type("application/json");
        String id = req.params("id");
        String contact;
        try {
            contact = contactController.getItem(id);
        } catch (IllegalArgumentException e) {
            res.status(400);
            res.body("The requested contact id " + id + " wasn't a legal Mongo Object ID." +
                "\n See 'https://docs.mongodb.com/manual/reference/method/ObjectID/' for more information");
            return "";
        }
        if (contact != null) {
            return contact;
        }
        else {
            res.status(404);
            res.body("The requested contact with id " + id + " wasn't found");
            return "";
        }
    }

    public String getContacts(Request req, Response res) {
        res.type("applications/json");
        return contactController.getItems(req.queryMap().toMap());
    }

    public String addNewContact(Request req, Response res) {
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if (o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbObject = (BasicDBObject) o;
                    String phone = dbObject.getString("phone");
                    String email = dbObject.getString("email");
                    String contactName = dbObject.getString("name");

                    System.out.println("Adding new contact with [contactName=" + contactName +
                        ", user email=" + email + ", and phone=" + phone + "]");
                    return contactController.addNewContact(phone, email, contactName);
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
