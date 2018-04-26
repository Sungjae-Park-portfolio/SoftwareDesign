package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.apache.commons.io.IOUtils;
import spark.Request;
import spark.Response;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

import spark.Route;
import umm3601.emoji.EmojiController;
import umm3601.emoji.EmojiRequestHandler;
import umm3601.goal.GoalRequestHandler;
import umm3601.goal.GoalController;
import umm3601.response.ResponseController;
import umm3601.response.ResponseRequestHandler;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.journal.JournalController;
import umm3601.journal.JournalRequestHandler;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import org.json.*;

public class Server {
    private static final String databaseName = "dev";
    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase emojiDatabase = mongoClient.getDatabase(databaseName);

        EmojiController emojiController = new EmojiController(emojiDatabase);
        EmojiRequestHandler emojiRequestHandler = new EmojiRequestHandler(emojiController);

        GoalController goalController = new GoalController(emojiDatabase);
        GoalRequestHandler goalRequestHandler = new GoalRequestHandler(goalController);

        JournalController journalController = new JournalController(emojiDatabase);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);

        UserController userController = new UserController(emojiDatabase);
        UserRequestHandler userRequestHandler = new UserRequestHandler(userController);

        ResponseController responseController = new ResponseController(emojiDatabase);
        ResponseRequestHandler responseRequestHandler = new ResponseRequestHandler(responseController);

        //Configure Spark
        port(serverPort);
        enableDebugScreen();

        // Specify where assets like images will be "stored"
        staticFiles.location("/public");

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));


        // Simple example route
        get("/hello", (req, res) -> "Hello World");

        // Redirects for the "home" page
        redirect.get("", "/");
        redirect.get("/about", "/");
        redirect.get("/reports", "/");
        redirect.get("/resources", "/");
        redirect.get("/journaling", "/");
        redirect.get("/goals", "/");
        //get("/google83434285ffe11fe1.html", (req, res) -> "/google83434285ffe11fe1.html");

        Route clientRoute = (req, res) -> {
            InputStream stream = goalController.getClass().getResourceAsStream("/public/index.html");
            return stream != null ? IOUtils.toString(stream) : "Sorry, we couldn't find that!";
        };
        Route notFoundRoute = (req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        };

        get("/", clientRoute);


        /// User Endpoints ///////////////////////////
        /////////////////////////////////////////////

        // Response get requests
        get("api/response", responseRequestHandler::getRandomResponse);
        get("api/responses", responseRequestHandler::getResponses);

        // User get requests
        get("api/users", userRequestHandler::getUsers);

        // Emotion get requests
        get("api/emojis", emojiRequestHandler::getEmojis);
        get("api/emojis/:id", emojiRequestHandler::getEmojiJSON);

        // Goals get requests
        get("api/goals", goalRequestHandler::getGoals);
        get("api/goals/:id", goalRequestHandler::getGoalJSON);


        get("api/journaling", journalRequestHandler::getJournals);
        get("api/journaling/:id", journalRequestHandler::getJournalJSON);
        post("api/emojis/new", emojiRequestHandler::addNewEmoji);
        post("api/goals/new", goalRequestHandler::addNewGoal);
        post("api/goals/edit", goalRequestHandler::editGoal);
        post("api/journaling/new", journalRequestHandler::addNewJournal);
        post("api/journaling/edit", journalRequestHandler::editJournal);
        post("api/response/new", responseRequestHandler::addNewResponse);

        post("api/login", (req, res) -> {

            JSONObject obj = new JSONObject(req.body());
            String authCode = obj.getString("code");


            try {
                // We can create this later to keep our secret safe

                String CLIENT_SECRET_FILE = "./src/main/java/umm3601/server_files/client_secret_file.json";

                GoogleClientSecrets clientSecrets =
                    GoogleClientSecrets.load(
                        JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));


                GoogleTokenResponse tokenResponse =
                    new GoogleAuthorizationCodeTokenRequest(
                        new NetHttpTransport(),
                        JacksonFactory.getDefaultInstance(),
                        "https://www.googleapis.com/oauth2/v4/token",
                        clientSecrets.getDetails().getClientId(),

                        // Replace clientSecret with the localhost one if testing
                        clientSecrets.getDetails().getClientSecret(),
                        authCode,
                        "http://localhost:9000")
                        //Not sure if we have a redirectUri

                        // Specify the same redirect URI that you use with your web
                        // app. If you don't have a web version of your app, you can
                        // specify an empty string.
                        .execute();


                GoogleIdToken idToken = tokenResponse.parseIdToken();
                GoogleIdToken.Payload payload = idToken.getPayload();
                String subjectId = payload.getSubject();  // Use this value as a key to identify a user.
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String locale = (String) payload.get("locale");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");


                System.out.println(subjectId);
                System.out.println(email);
                System.out.println(name);
                System.out.println(locale);

                return userController.addNewUser(subjectId, givenName, familyName);

            } catch (Exception e) {
                System.out.println(e);
            }

            return "";
        });

        // An example of throwing an unhandled exception so you can see how the
        // Java Spark debugger displays errors like this.
        get("api/error", (req, res) -> {
            throw new RuntimeException("A demonstration error");
        });
    }

    // Enable GZIP for all responses
    private static void addGzipHeader(Request request, Response response) {
        response.header("Content-Encoding", "gzip");
    }
}
