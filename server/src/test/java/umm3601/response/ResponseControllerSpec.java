package umm3601.response;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.ControllerSuperSpec;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class ResponseControllerSpec extends ControllerSuperSpec {
    private ResponseController responseController;
    private ObjectId id;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> responseDocs = db.getCollection("responses");
        responseDocs.drop();

        List<Document> testResponses = new ArrayList<>();

        testResponses.add(Document.parse("{\n" +
            "name: \"Fluffy bunnies\", \n" +
            "link: \"https://fluffybun.ny/getBunny\",\n" +
            "userID: \"aurora@boreal.is\", \n" +
            "}"));
        testResponses.add(Document.parse("{\n" +
            "name: \"Satisfying video\", \n" +
            "link: \"https://mycylinder.nomnom/getNom\",\n" +
            "userID: \"aurora@austral.is\", \n" +
            "}"));
        testResponses.add(Document.parse("{\n" +
            "name: \"Motivational song\", \n" +
            "link: \"https://justdoit.justdo/getJustIt\",\n" +
            "userID: \"shialabeouf@shiasurprise.net\", \n" +
            "}"));

        id = new ObjectId();
        BasicDBObject stressRelief = new BasicDBObject("_id", id);
        stressRelief = stressRelief
            .append("name", "Stress relief for programmers")
            .append("link", "https://breathe.io")
            .append("userID", "all@of.us");

        responseDocs.insertMany(testResponses);
        responseDocs.insertOne(Document.parse(stressRelief.toJson()));

        responseController = new ResponseController(db);
    }

    private static String getuserID(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("userID")).getValue();
    }

    private static String getName(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getAllResponses() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = responseController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 entries", 4, docs.size());
        List<String> userIDs = docs
            .stream()
            .map(ResponseControllerSpec::getuserID)
            .sorted()
            .collect(Collectors.toList());
        List<String> expecteduserIDs = Arrays.asList("all@of.us",
            "aurora@austral.is",
            "aurora@boreal.is",
            "shialabeouf@shiasurprise.net");
        assertEquals("userIDs should match", expecteduserIDs, userIDs);
    }

    @Test
    public void getResponsesByuserID() {
        Map<String, String[]> map = new HashMap<>();
        map.put("userID", new String[]{"aurora@boreal.is"});
        String jsonResult = responseController.getItems(map);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 entry", 1, docs.size());
        assertEquals("Should be called 'Fluffy bunnies'", "Fluffy bunnies", getName(docs.get(0)));
    }

    @Test
    public void getRandomResponse() {
        Map<String, String[]> map = new HashMap<>();
        map.put("userID", new String[]{"aurora@boreal.is"});
        String jsonResult = responseController.getRandomResponse(map);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should only be one entry in the array", 1, docs.size());
        assertTrue("Should contain http in the link", docs.get(0)
            .asDocument()
            .get("link")
            .asString()
            .toString()
            .contains("http"));

    }

    @Test
    public void addLink() {
        responseController.addNewResponse("End of the world",
            "aurora@boreal.is",
            "https://ragnar.uk");
        Map<String, String[]> map = new HashMap<>();
        map.put("userID", new String[]{"aurora@boreal.is"});
        assertTrue("the new link is present for the user",
            responseController.getItems(map).contains("https://ragnar.uk"));

    }
}
