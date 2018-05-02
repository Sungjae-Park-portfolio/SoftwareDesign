import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {contact} from "./contact";
import {ContactService} from "./contact.service";



describe('Contact list service: ', () => {
    // A small collection of test journals
    const testContact: contact[] = [
        {
            _id: '5ab2bc3742f5a7b6f0f48626',
            name: 'Lir Fealladh',
            phone: '555-555-5550',
            email: 'Lir@Fealladh.com',
            userID: '789159',

        },
        {
            _id: '5ab2bc37bc8681f8f0ddf797',
            name: 'Reina',
            phone: '555-555-5551',
            email: 'Reina@myfriend.com',
            userID: '123357',

        },
        {
            _id: '5ab2bc370290adc56f8065fc',
            name: 'Suicide Prevention Lifeline',
            phone: '1-800-555-5555',
            email: 'preventsuicide@lifeline.org',
            userID: '741456',

        }
    ];
    const mContact: contact[] = testContact.filter(contact =>
        contact.name.toLowerCase().indexOf('m') !== -1
    );

    // We will need some url information from the journalListService to meaningfully test subject filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let contactService: ContactService;
    let currentlyImpossibleToGenerateSearchContactUrl: string;

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
        // Construct an instance of the service with the mock
        // HTTP client.
        contactService = new ContactService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getContact() calls api/contact', () => {
        // Assert that the journals we get from this call to getJournals()
        // should be our set of test journals. Because we're subscribing
        // to the result of getJournals(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testJournals) a few lines
        // down.
        contactService.getContact('').subscribe(
            contact => expect(contact).toBe(testContact)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(contactService.baseUrl + '?email=');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testContact);
    });

    it('getContactById() calls api/contact/id', () => {
        const targetContact: contact = testContact[1];
        const targetId: string = targetContact._id;
        contactService.getContactById(targetId).subscribe(
            contact => expect(contact).toBe(targetContact)
        );

        const expectedUrl: string = contactService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetContact);
    });

    it('adding a contact calls api/contact/new', () => {
        const bryon_id = { '$oid': 'bryon_id' };
        const newContact: contact = {
            _id: '5ab2bc37e194ff1f2434eb46',
            name: 'Bryon',
            phone: "555-555-5552",
            email: "bryonotherbestfriend.gov",
            userID: '369951',
        };

        contactService.addContact(newContact).subscribe(
            id => {
                expect(id).toBe(bryon_id);
            }
        );

        const expectedUrl: string = contactService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('POST');
        req.flush(bryon_id);
    });

    it('editContact calls api/contact/edit', () => {
        const bryon_id = { '$oid': 'bryon_id' };
        const editedContact : contact = {
            _id: '5ab2bc37e194ff1f2434eb46',
            name: 'Bryon',
            phone: "555-666-5552",
            email: "bryonotherbestfriend.gov",
            userID: '369951',
        };

        contactService.editContact(editedContact).subscribe(
            res => {
                expect(res).toBe(bryon_id);
            }
        );

        const expectedUrl: string = contactService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(editedContact);
        req.flush(bryon_id);
    });

    it('deleteJournal calls api/journals/delete/id', () => {
        const bryon_id = { '$oid': 'pennington_id' };


        contactService.deleteContact(bryon_id['$oid']).subscribe(
            res => {
                expect(res).toBe(bryon_id);
            }
        );

        const expectedUrl: string = contactService.baseUrl + '/delete/' + bryon_id['$oid'];
        const req = httpTestingController.expectOne(expectedUrl);
        console.log(req);
        expect(req.request.method).toEqual('DELETE');
        req.flush(bryon_id);
    });
});
