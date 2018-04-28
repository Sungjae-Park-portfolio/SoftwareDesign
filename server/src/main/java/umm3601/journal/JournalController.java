package umm3601.journal;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Iterator;
import java.util.Map;

import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class JournalController extends SuperController {

    /**
     * journalController constructor
     *
     * @param database
     */
    public JournalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("journals");
    }

    public String addNewJournal(String subject, String body, String SubjectID) {
        Document newJournal = new Document();
        newJournal.append("subject", subject);
        newJournal.append("body", body);
        newJournal.append("SubjectID", SubjectID);

        Date now = new Date();
        newJournal.append("date", now.toString());

        try {
            collection.insertOne(newJournal);
            ObjectId id = newJournal.getObjectId("_id");
            System.err.println("Successfully added new journal [_id=" + id + ", subject=" + subject + ", body=" + body + ", date=" + now + ']');
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editJournal(String id, String subject, String body){
        System.out.println("Right here again");
        Document newJournal = new Document();
        newJournal.append("subject", subject);
        newJournal.append("body", body);
        Document setQuery = new Document();
        setQuery.append("$set", newJournal);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);



        try {
            collection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated journal [_id=" + id1 + ", subject=" + subject + ", body=" + body + ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
