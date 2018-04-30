package umm3601;

import com.google.gson.Gson;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

/**
 * This is an abstract class that provides the general methods
 * getItem and getItems for all controllers, which is subclassed
 * by all controllers. That allows them to use the methods
 * defined in here. More specific methods are defined in
 * individual controllers, like addNewJournal.
 */
public abstract class SuperController {
    protected Gson gson = null;
    protected MongoDatabase database = null;
    protected MongoCollection<Document> collection = null;

    /**
     *
     * @param id: a string representation of an ObjectId that is
     *          linked to the object desired.
     * @return: the JSON that represents the desired item, or null
     * if not found.
     */
    public String getItem(String id) {

        FindIterable<Document>  jsonObjects
            = collection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonObjects.iterator();
        if (iterator.hasNext()) {
            Document item = iterator.next();
            return item.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    /**
     *
     * @param queryParams: a Map that contains the keys and
     *                   values of the items we're looking for.
     *                   The values are the array, but we only
     *                   care about the first value that is related
     *                   to the key for now.
     * @return: a JSON representation of all items found
     * given the search criteria.
     */
    public String getItems(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("userID")) {
            String targetSubjectID = (queryParams.get("userID")[0]);
            filterDoc = filterDoc.append("userID", targetSubjectID);
        }

        if (queryParams.containsKey("email")) {
            String targetEmail = (queryParams.get("email")[0]);
            filterDoc = filterDoc.append("email", targetEmail);
        }

        if (queryParams.containsKey("user_id")) {
            String targetUserId = (queryParams.get("user_id")[0]);
            filterDoc = filterDoc.append("user_id", targetUserId);
        }

        if (queryParams.containsKey("subject")) {
            String targetContent = (queryParams.get("subject")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("subject", contentRegQuery);        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        if (queryParams.containsKey("status")) {
            Boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }



        FindIterable<Document> matchingItems = collection.find(filterDoc);

        return JSON.serialize(matchingItems);
    }
}
