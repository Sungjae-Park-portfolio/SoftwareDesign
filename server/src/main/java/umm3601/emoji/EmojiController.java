package umm3601.emoji;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Date;

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

    public String addNewEmoji(String userID, int mood, int intensity) {

        Document newEmoji = new Document();
        newEmoji.append("userID", userID);
        newEmoji.append("mood", mood);
        newEmoji.append("intensity", intensity);

        Date now = new Date();
        newEmoji.append("date", now.toString());

        try {
            collection.insertOne(newEmoji);

            ObjectId id = newEmoji.getObjectId("_id");
            System.err.println("Successfully added new emoji [_id=" + id + ", userID=" + userID + ", mood="
                + mood + " date=" + now + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
