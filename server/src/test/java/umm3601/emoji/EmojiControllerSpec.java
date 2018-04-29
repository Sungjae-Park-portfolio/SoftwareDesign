package umm3601.emoji;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class EmojiControllerSpec {
    private EmojiController emojiController;
    private ObjectId mattsId;
    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emojiDocuments = db.getCollection("emojis");
        emojiDocuments.drop();
        List<Document> testEmojis = new ArrayList<>();
        testEmojis.add(Document.parse("{\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060b\",\n" +
            "                    mood: 5,\n" +
            "                    intensity: 2\n" +
            "                    date: \"" + new Date() + "\",\n" +
            "                }"));
        testEmojis.add(Document.parse("{\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060a\",\n" +
            "                    mood: 3,\n" +
            "                    intensity: 3\n" +
            "                    date: \"" + new Date() + "\",\n" +
            "                }"));
        testEmojis.add(Document.parse("{\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060c\",\n" +
            "                    mood: 2,\n" +
            "                    intensity: 1\n" +
            "                    date: \"" + new Date() + "\",\n" +
            "                }"));

        mattsId = new ObjectId();
        BasicDBObject matt = new BasicDBObject("_id", mattsId);
        matt = matt.append("userID", "5ae21df81ce1aa2ca211060d")
            .append("intensity", 4)
            .append("mood", 1)
            .append("date", new Date());



        emojiDocuments.insertMany(testEmojis);
        emojiDocuments.insertOne(Document.parse(matt.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        emojiController = new EmojiController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getUserID(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("userID")).getValue();
    }

    @Test
    public void getEmojiById() {
        String jsonResult = emojiController.getItem(mattsId.toHexString());
        System.out.println(jsonResult);
        Document matt = Document.parse(jsonResult);

        assertEquals("Name should match", "5ae21df81ce1aa2ca211060d", matt.getString("userID"));
        String noJsonResult = emojiController.getItem(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    @Test
    public void addEmojiTest(){
        String newId = emojiController.addNewEmoji("123456",5, 2);

        assertNotNull("Add new emoji should return true when an emoji is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("123456", new String[] { "123456" });
        String jsonResult = emojiController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> userID = docs
            .stream()
            .map(EmojiControllerSpec::getUserID)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the userID of the new emoji", "123456", userID.get(0));
    }

}

