package umm3601.journal;

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
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class JournalControllerSpec extends ControllerSuperSpec {
    private JournalController journalController;
    private ObjectId nicId;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocs = db.getCollection("journals");
        journalDocs.drop();
        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                           subject: \"3601 is hard\", \n" +
            "                           body: \"I'm having a hard time with writing all these tests\"" +
            "                           userID: \"123456\"" +
            "                           date: \"8/20/2015 20:00\",\n" +
            "                        }"));
        testJournals.add(Document.parse("{\n" +
            "                           subject: \"3601 is easy\", \n" +
            "                           body: \"All this programming and communication is super easy\"" +
            "                           userID: \"987654\"" +
            "                           date: \"1/1/1970 1:00\",\n" +
            "                        }"));
        nicId = new ObjectId();
        BasicDBObject nic = new BasicDBObject("_id", nicId);
        nic = nic.append("subject", "I love teaching Software Development")
            .append("body", "All these college students are so good at everything and we'll give them all A's")
            .append("date", "12/22/2012 19:00")
            .append("userID", "8123");
        journalDocs.insertMany(testJournals);
        journalDocs.insertOne(Document.parse(nic.toJson()));

        journalController = new JournalController(db);
    }

    private static String getUserID(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("userID")).getValue();
    }

    private static String getSubject(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("subject")).getValue();
    }


    @Test
    public void getJournalById() {
        String jsonResult = journalController.getItem(nicId.toHexString());
        System.out.println(jsonResult);
        Document nic = Document.parse(jsonResult);

        assertEquals("Journal subject should match", "I love teaching Software Development", nic.getString("subject"));
        String noJsonResult = journalController.getItem(new ObjectId().toHexString());
        assertNull("No entry should match", noJsonResult);
    }

    @Test
    public void addJournalTest() {
        String newId = journalController.addNewJournal("I am ok with 3601.", "It's not great, it's not bad.", "me@apat.hy");

        assertNotNull("Add new journal should return true when a journal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("subject", new String[]{"I am ok with 3601."});
        String jsonResult = journalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> userIDList = docs
            .stream()
            .map(JournalControllerSpec::getUserID)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the email of the new journal entry", "me@apat.hy", userIDList.get(0));
    }

    @Test
    public void editJournalTest() {
        String jsonId = journalController.editJournal(nicId.toHexString(), "Java is the best language", "nic@college.com");
        System.out.println(jsonId);
        ObjectId id = parseObjectId(jsonId);
        String jsonResult = journalController.getItem(id.toHexString());
        Document nic1 = Document.parse(jsonResult);
        assertEquals("Subject should match", "Java is the best language", nic1.getString("subject"));

    }
}
