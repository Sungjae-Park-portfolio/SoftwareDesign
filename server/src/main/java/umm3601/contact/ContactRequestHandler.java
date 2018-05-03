package umm3601.contact;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ContactRequestHandler {
    private final ContactController contactController;
    public ContactRequestHandler(ContactController contactController){
        this.contactController = contactController;
    }

    /**Method called from Server when the 'api/crisis' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getContactJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String contact;
        try {
            contact = contactController.getContact(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested contacts id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (contact != null) {
            return contact;
        } else {
            res.status(404);
            res.body("The requested contact with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/resources' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of resourcess in JSON formatted String
     */
    public String getContact(Request req, Response res)
    {
        res.type("application/json");
        return contactController.getContact(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/resources/new'endpoint is recieved.
     * Gets specified resources info from request and calls addNewResources helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the resources was added successfully or not
     */
    public String addNewContact(Request req, Response res)
    {
        System.out.println("Received a request to add a new contact");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String id = dbO.getString("_id");
                    String name = dbO.getString("name");
                    String email = dbO.getString("email");
                    String phone = dbO.getString("phone");
                    Boolean favorite = dbO.getBoolean("favorite");


//
//                    System.err.println("Adding new resource [id=" + id + ", name=" + name + " phonenumber=" + phonenumber + "email" + email  + ']');
                    return contactController.addNewContact( id, name, email, phone, favorite).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new contacts request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

    public String editContact(Request req, Response res)
    {
        System.out.println("Right here");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String name = dbO.getString("name");
                    String email = dbO.getString("email");
                    String phone = dbO.getString("phone");
                    Boolean favorite = dbO.getBoolean("favorite");



                    System.err.println("Editing contact [ id=" + id + ", name=" + name + ", email=" + email + ",phone=" + phone + ']');
                    return contactController.editContact(id, name, email, phone, favorite).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new contact request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

    public String deleteContact(Request req, Response res){

        System.out.println("I'm here");
        System.out.println(req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            contactController.deleteContact(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
