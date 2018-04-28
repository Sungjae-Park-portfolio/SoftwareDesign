package umm3601.user;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.ControllerSuperSpec;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class UserControllerSpec extends ControllerSuperSpec{
    private UserController userController;
    private ObjectId kylesId;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> userDocuments = db.getCollection("users");
        userDocuments.drop();
        List<Document> testUsers = new ArrayList<>();
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"123456\",\n" +
            "                    FirstName: \"Ethan\",\n" +
            "                    LastName: \"Hamer\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"987654\",\n" +
            "                    FirstName: \"Aurora\",\n" +
            "                    LastName: \"Cordes\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"8123\",\n" +
            "                    FirstName: \"Jubair\",\n" +
            "                    LastName: \"Hassan\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"64785\",\n" +
            "                    FirstName: \"Hunter\",\n" +
            "                    LastName: \"Welch\",\n" +
            "                }"));

        kylesId = new ObjectId();
        BasicDBObject song = new BasicDBObject("_id", kylesId);
        song = song.append("SubjectID", "654321")
            .append("FirstName", "Song")
            .append("LastName", "Yujing");



        userDocuments.insertMany(testUsers);
        userDocuments.insertOne(Document.parse(song.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        userController = new UserController(db);
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("FirstName")).getValue();
    }

    @Test
    public void getAllUsers() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = userController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 5 users", 5, docs.size());
        List<String> names = docs
            .stream()
            .map(UserControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Aurora", "Ethan", "Hunter", "Jubair", "Song");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getUserById() {
        String jsonResult = userController.getItem(kylesId.toHexString());
        System.out.println(jsonResult);
        Document song = Document.parse(jsonResult);

        assertEquals("Name should match", "Song", song.getString("FirstName"));
        String noJsonResult = userController.getItem(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    @Test
    public void addUserTest(){
        String newId = userController.addNewUser("987123","Roch","Jongh");

        assertNotNull("Add new user should return true when a user is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("SubjectID", new String[] { "987123" });
        String jsonResult = userController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(UserControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the new owner", "Song", name.get(5));
    }


}
