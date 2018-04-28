package umm3601.goal;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class GoalController extends SuperController{

    /**
     * Construct a controller for goals.
     *
     * @param database the database containing goals data
     */
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("goals");
    }

    public String addNewGoal(String name, String category,
                             String startDate, String endDate, String frequency, Boolean status, String SubjectID) {

        Document newGoal = new Document();
        newGoal.append("SubjectID", SubjectID);
        newGoal.append("name", name);
        newGoal.append("category", category);
        newGoal.append("startDate", startDate);
        newGoal.append("endDate", endDate);
        newGoal.append("frequency", frequency);
        newGoal.append("status", status);



        try {
            collection.insertOne(newGoal);

            ObjectId id = newGoal.getObjectId("_id");
            System.err.println("Successfully added new goal [_id=" + id + ", name="
                + name + " category=" + category + " startDate=" + startDate + " endDate=" + endDate +
                " frequency=" + frequency + " status=" + status + " SubjectID=" + SubjectID + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String editGoal(String id, String name, String category, String startDate, String endDate, String frequency, Boolean status, String SubjectID){
        System.out.println("Right here again");
        Document newGoal = new Document();
        newGoal.append("name", name);
        newGoal.append("category", category);
        newGoal.append("startDate", startDate);
        newGoal.append("endDate", endDate);
        newGoal.append("frequency", frequency);
        newGoal.append("status", status);
        newGoal.append("SubjectID", SubjectID);
        Document setQuery = new Document();
        setQuery.append("$set", newGoal);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);



        try {
            collection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated goal [ id=" + id + ", name=" + name + ", category=" + category + ", startDate=" + startDate + ", endDate=" + endDate + ", frequency=" + frequency + ", status=" + status +  ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
