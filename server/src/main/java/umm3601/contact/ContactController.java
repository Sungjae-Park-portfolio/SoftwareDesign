package umm3601.contact;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;
import static com.mongodb.client.model.Filters.eq;
import umm3601.SuperController;


public class ContactController  extends SuperController{
    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the resources data is in.
    private final MongoCollection<Document> contactCollection;

    // Construct controller for resources.
    public ContactController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        contactCollection = database.getCollection("contact");
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified.
    public String getContact(String id) {

        FindIterable<Document> jsonContact
            = contactCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonContact.iterator();
        if (iterator.hasNext()) {
            Document contacts = iterator.next();
            return contacts.toJson();
        } else {
            // We didn't find the desired Resource
            return null;
        }
    }


    public String getContact(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingContact = contactCollection.find(filterDoc);


        return JSON.serialize(matchingContact);
    }

    public String editContact(String id, String name, String email, String phone, Boolean favorite){
        System.out.println("Right here again");
        Document newContact = new Document();
        newContact.append("name", name);
        newContact.append("email", email);
        newContact.append("phone", phone);
        newContact.append("favorite", favorite);
        Document setQuery = new Document();
        setQuery.append("$set", newContact);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);



        try {
            contactCollection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated contact [_id=" + id1 + ", name=" + name + ", email=" + email + ",phone=" + phone + ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }


    public String addNewContact(String userID, String name, String email, String phone, Boolean favorite) {
        System.out.println("Adding new contact " + name);

        Document newContact = new Document();
        newContact.append("userID", userID);
        newContact.append("name", name);
        newContact.append("email", email);
        newContact.append("phone", phone);
        newContact.append("favorite", favorite);




        try {
            contactCollection.insertOne(newContact);

            ObjectId Id = newContact.getObjectId("_id");
            System.err.println("Successfully added new contacts [userID=" + userID + ", name=" + name + ", email=" + email + " phone=" + phone + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
    public void deleteContact(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            collection.deleteOne(searchQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted contact " + id1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }
}
