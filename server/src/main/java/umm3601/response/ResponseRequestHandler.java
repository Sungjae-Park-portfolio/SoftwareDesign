package umm3601.response;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class ResponseRequestHandler {
    private ResponseController responseController;

    public ResponseRequestHandler(ResponseController responseController) {
        this.responseController = responseController;
    }

    public String addNewResponse(Request req, Response res) {
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String name = dbO.getString("name");
                    String link = dbO.getString("link");
                    String SubjectID = dbO.getString("userID");

                    System.err.println("Adding new response [name=" + name + ", link=" + link + ']');
                    return responseController.addNewResponse(name, SubjectID, link);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new response request failed.");
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

    public String getResponses(Request req, Response res)
    {
        res.type("application/json");
        return responseController.getItems(req.queryMap().toMap());
    }

    public String getRandomResponse(Request req, Response res) {
        res.type("application/json");
        return responseController.getRandomResponse(req.queryMap().toMap());
    }
}
