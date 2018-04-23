package umm3601.contacts;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

public class ResourceController extends SuperController {

    public ResourceController(MongoDatabase database) {
        this.gson = new Gson();
        this.database = database;
        this.collection = database.getCollection("contacts");
    }

    public String addNewResource(String phone, String userEmail, String name) {
        Document newResource = new Document();
        newResource.append("phone", phone);
        newResource.append("email", userEmail);
        newResource.append("name", name);

        try {
            collection.insertOne(newResource);

            ObjectId id = newResource.getObjectId("_id");
            System.out.println("Successfully added new resource with " +
                "[_id=" + id + ", email=" + userEmail + ", phone=" + phone + "]");

            return JSON.serialize(id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
