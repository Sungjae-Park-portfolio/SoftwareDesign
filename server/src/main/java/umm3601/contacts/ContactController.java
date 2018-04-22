package umm3601.contacts;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

public class ContactController extends SuperController {

    public ContactController(MongoDatabase database) {
        this.gson = new Gson();
        this.database = database;
        this.collection = database.getCollection("contacts");
    }

    public String addNewContact(String phone, String userEmail, String name) {
        Document newContact = new Document();
        newContact.append("phone", phone);
        newContact.append("email", userEmail);
        newContact.append("name", name);

        try {
            collection.insertOne(newContact);

            ObjectId id = newContact.getObjectId("_id");
            System.out.println("Successfully added new contact with " +
                "[_id=" + id + ", email=" + userEmail + ", phone=" + phone + "]");

            return JSON.serialize(id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
