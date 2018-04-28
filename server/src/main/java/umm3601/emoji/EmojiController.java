package umm3601.emoji;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class EmojiController extends SuperController {

    /**
     * Construct a controller for emojis.
     *
     * @param database the database containing emoji data
     */
    public EmojiController(MongoDatabase database) {
        this.gson = new Gson();
        this.database = database;
        this.collection = database.getCollection("emojis");
    }

    public String addNewEmoji(String ownerId, int mood, int intensity) {

        Document newEmoji = new Document();
        newEmoji.append("SubjectID", ownerId);
        newEmoji.append("mood", mood);
        newEmoji.append("intensity", intensity);

        Date now = new Date();
        newEmoji.append("date", now.toString());

        try {
            collection.insertOne(newEmoji);

            ObjectId id = newEmoji.getObjectId("_id");
            System.err.println("Successfully added new emoji [_id=" + id + ", SubjectID=" + ownerId + ", mood="
                + mood + " date=" + now + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
