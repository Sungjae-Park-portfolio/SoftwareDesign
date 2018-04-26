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
import umm3601.emoji.EmojiControllerSpec;

import java.io.IOException;
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
            "                    owner: \"Ahnaf\",\n" +
            "                    name: \"Do the Dishes\",\n" +
            "                    status: false,\n" +
            "                    creation_date: \"8/20/2015 20:00\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    owner: \"Aurora\",\n" +
            "                    name: \"Call Mom\",\n" +
            "                    status: false,\n" +
            "                    creation_date: \"7/13/2016 08:00\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    owner: \"Ethan\",\n" +
            "                    name: \"Fold Laundry\",\n" +
            "                    status: false,\n" +
            "                    creation_date: \"2/10/2017 12:00\",\n" +
            "                }"));

        mattsId = new ObjectId();
        BasicDBObject matt = new BasicDBObject("_id", mattsId);
        matt = matt.append("owner", "Matt")
            .append("name", "Eat Breakfast")
            .append("status", false)
            .append("creation_date", "11/11/2011 09:00");



        emojiDocuments.insertMany(testGoals);
        emojiDocuments.insertOne(Document.parse(matt.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        goalController = new GoalController(db);
    }


    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllUsers() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = goalController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 users", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(GoalControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Ahnaf", "Aurora", "Ethan", "Matt");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void addGoalTest() {
        String newId = goalController.addNewGoal("Matt2",
            "Matt2",
            "Make good code",
            "Programming",
            "8/19/2015 14:00",
            "8/20/2015 14:00",
            "Weekly",
            false,
            "");

        assertNotNull("Add new goal should return true when a goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("Matt2", new String[] { "Matt2" });
        String jsonResult = goalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the owner of the new goal", "Matt2", name.get(4));
    }

    @Test
    public void editGoalTest() {
        String newGoal = goalController.addNewGoal("Roch",
            "Roch",
            "Tak to people",
            "Social",
            "6/19/2015 14:00",
            "6/20/2015 14:00",
            "Daily",
            false,
            "");

        assertNotNull("Add new goal should return true when a goal is added,", newGoal);

        System.out.println(newGoal);

        String editGoal = goalController.editGoal(parseObjectId(newGoal).toString(), "Roch", "Social", "6/19/2015 14:00", "6/20/2015 14:00", "Daily", true);

        assertNotNull("Edited goal should not return null,", editGoal);

        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "true" });
        String jsonResult = goalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        System.out.println(docs);

        assertEquals("Should be only 1 goal", 1, docs.size());


        List<String> owners = docs
            .stream()
            .map(GoalControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Roch");
        assertEquals("Owners should match", expectedOwners, owners);
    }
}
