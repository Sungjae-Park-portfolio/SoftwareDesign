import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {Emoji} from '../emoji';

import {ReportsService} from "./reports.service";

describe('Report service: ', () => {
    // A small collection of test emojis
    const testEmojis: Emoji[] = [
        {
            _id: "a98ab3747faebe4490d5154",
            userID: '123456',
            mood: 5,
            intensity: 3,
            date: new Date("8/20/2015 20:00"),
            ownerFirstName: "Ahnaf",
        },
        {

            _id: "a98ab3747faebe4490d5153",
            userID: '987654',
            mood: 3,
            intensity: 1,
            date: new Date("8/20/2018 20:00"),
            ownerFirstName: "Chuck",
        },
        {
            _id: "a98ab3747faebe4490d5151",
            userID: '654321',
            mood: 3,
            intensity: 1,
            date: new Date("8/23/2018 20:00"),
            ownerFirstName: "Matt",
        },
    ];



    // We will need some url information from the userListService to meaningfully test company filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let reportsListService: ReportsService;
    let currentlyImpossibleToGenerateSearchEmojiUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service emojiOwner?: stringwith the mock
        // HTTP client.
        reportsListService = new ReportsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });


    it('getEmojis() calls api/emojis', () => {
        // Assert that the users we get from this call to getUsers()
        // should be our set of test users. Because we're subscribing
        // to the result of getUsers(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testUsers) a few lines
        // down.

        reportsListService.getEmojis().subscribe(
            emojis => expect(emojis).toBe(testEmojis)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(reportsListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testEmojis);
    });



    it('filterByUserID(userID) deals appropriately with a URL that already had an ID', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl = reportsListService.baseUrl + '?userID=123456&something=k&';
        reportsListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        reportsListService.filterByUserID('123456');
        expect(reportsListService['emojiUrl']).toEqual(reportsListService.baseUrl + '?something=k&userID=123456&');
    });

    it('ffilterByUserID(userID) deals appropriately with a URL that already had some filtering, but no user id', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl = reportsListService.baseUrl + '?something=k&';
        reportsListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        reportsListService.filterByUserID('123456');
        expect(reportsListService['emojiUrl']).toEqual(reportsListService.baseUrl + '?something=k&userID=123456&');
    });

    it('filterByUserID(userID) deals appropriately with a URL has the user id, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl= reportsListService.baseUrl + '?userID=&';
        reportsListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        reportsListService.filterByUserID('');
        expect(reportsListService['emojiUrl']).toEqual(reportsListService.baseUrl + '');
    });
});
