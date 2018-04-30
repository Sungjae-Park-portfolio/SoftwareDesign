package umm3601.goal;

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

public class GoalControllerSpec extends ControllerSuperSpec{
    private GoalController goalController;
    private ObjectId mattsId;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emojiDocuments = db.getCollection("goals");
        emojiDocuments.drop();
        List<Document> testGoals = new ArrayList<>();
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Do the Dishes\",\n" +
            "                    category: \"Chores\",\n" +
            "                    startDate: \"2018-04-11T05:00:00.000Z\",\n" +
            "                    endDate: \"2018-04-26T05:00:00.000Z\",\n" +
            "                    frequency: \"2\",\n" +
            "                    status: false,\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060b\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Call Mom\",\n" +
            "                    category: \"Social\",\n" +
            "                    startDate: \"2018-04-11T05:00:00.000Z\",\n" +
            "                    endDate: \"2018-04-26T05:00:00.000Z\",\n" +
            "                    frequency: \"2\",\n" +
            "                    status: false,\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060b\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Fold Laundry\",\n" +
            "                    category: \"Chores\",\n" +
            "                    startDate: \"2018-04-11T05:00:00.000Z\",\n" +
            "                    endDate: \"2018-04-26T05:00:00.000Z\",\n" +
            "                    frequency: \"2\",\n" +
            "                    status: false,\n" +
            "                    userID: \"5ae21df81ce1aa2ca211060b\",\n" +
            "                }"));

        mattsId = new ObjectId();
        BasicDBObject matt = new BasicDBObject("_id", mattsId);
        matt = matt.append("name", "Eat Breakfast")
            .append("category", "Health")
            .append("startDate", "2018-04-11T05:00:00.000Z")
            .append("endDate", "2018-04-26T05:00:00.000Z")
            .append("frequency", "2")
            .append("status", false)
            .append("userID", "5ae21df81ce1aa2ca211060b");



        emojiDocuments.insertMany(testGoals);
        emojiDocuments.insertOne(Document.parse(matt.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        goalController = new GoalController(db);
    }


    private static String getUserID(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("userID")).getValue();
    }

    @Test
    public void addGoalTest() {
        String newId = goalController.addNewGoal("Make good code",
            "Other",
            "2018-04-11T05:00:00.000Z",
            "2018-04-26T05:00:00.000Z",
            "Every Day",
            true,
            "5ae21df81ce1aa2ca211060b");

        assertNotNull("Add new goal should return true when a goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("5ae21df81ce1aa2ca211060b", new String[] { "5ae21df81ce1aa2ca211060b" });
        String jsonResult = goalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getUserID)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the userID of the new goal", "5ae21df81ce1aa2ca211060b", name.get(4));
    }

    @Test
    public void editGoalTest() {
        String newGoal = goalController.addNewGoal("Talk to people",
            "Social",
            "2018-04-11T05:00:00.000Z",
            "2018-04-26T05:00:00.000Z",
            "3",
            false,
            "5ae21df81ce1aa2ca211060b");

        assertNotNull("Add new goal should return true when a goal is added,", newGoal);

        System.out.println(newGoal);

        String editGoal = goalController.editGoal(parseObjectId(newGoal).toString(), "Talk to people", "Social",
            "2018-04-11T05:00:00.000Z", "2018-04-26T05:00:00.000Z", "Daily", true, "5ae21df81ce1aa2ca211060b");

        assertNotNull("Edited goal should not return null,", editGoal);

        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "true" });
        String jsonResult = goalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        System.out.println(docs);

        assertEquals("Should be only 1 goal", 1, docs.size());


        List<String> userIDs = docs
            .stream()
            .map(GoalControllerSpec::getUserID)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedUserIDs = Arrays.asList("5ae21df81ce1aa2ca211060b");
        assertEquals("userID's should match", expectedUserIDs, userIDs);
    }
}
