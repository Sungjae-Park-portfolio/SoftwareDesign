package umm3601.response;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.util.JSON;
import org.apache.commons.validator.routines.UrlValidator;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Arrays;
import java.util.Map;
import java.util.Random;

public class ResponseController extends SuperController{


    public ResponseController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("responses");
    }

    public String addNewResponse(String responseName, String responseUserID, String responseLink) {

        // makes the search Document key-pairs
        Document newResponse = new Document();
        UrlValidator validator = new UrlValidator();
        if(!(responseLink.contains("https://") || responseLink.contains("http://"))) {
            responseLink = "http://" + responseLink;
        }

        if (!(validator.isValid(responseLink))) {
            System.err.println("Invalid link, not adding to database.");
            return "Invalid Link";
        }

        // Append new resources here
        newResponse.append("name", responseName);
        newResponse.append("SubjectID", responseUserID);
        newResponse.append("link", responseLink);

        try {
            collection.insertOne(newResponse);
            ObjectId id = newResponse.getObjectId("_id");

            System.err.println("Successfully added new resource [_id=" + id + ", responseName=" + responseName + "," +
                " responseUserID=" + responseUserID + ", link=" + responseLink + ']');
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    @Override
    public String getItems(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("email")) {
            String targetEmail = (queryParams.get("email")[0]);
            filterDoc = filterDoc.append("email", "default");
            filterDoc = filterDoc.append("email", targetEmail);
        }

        FindIterable<Document> matchingItems = collection.find(filterDoc);

        return JSON.serialize(matchingItems);
    }


    // This is replacing a method on the client-side that picks a random link from a group
    public String getRandomResponse(Map<String, String[]> queryParams) {
        Document filterdoc = new Document();
        Document defaultDoc = new Document();

        // this uses aggregation to choose inclusive or of having default as email or the
        // user's email
        if (queryParams.containsKey("email")) {
            String targetEmail = (queryParams.get("email")[0]);
            filterdoc = filterdoc.append("email", targetEmail);
            defaultDoc = defaultDoc.append("email", "default");
            filterdoc = new Document("$or", Arrays.asList(filterdoc, defaultDoc));
        }

        AggregateIterable<Document> matchingItems = collection.aggregate(
            Arrays.asList(
            Aggregates.match(filterdoc),
            Aggregates.sample(1)
        ));

        System.out.println(JSON.serialize(matchingItems));
        if(JSON.serialize(matchingItems).equals("[ ]")) {
            return null;
        }
        return JSON.serialize(matchingItems);
    }
}
