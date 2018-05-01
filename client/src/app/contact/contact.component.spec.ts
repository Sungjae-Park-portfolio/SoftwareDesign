import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {contact} from "./contact";
import {ContactService} from "./contact.service";
import {ContactComponent} from "./contact.component";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Contact list', () => {

    let contactsList: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;

    let contactListServiceStub: {
        getContact: () => Observable<contact[]>
    };

    beforeEach(() => {
        // stub CrisisService for test purposes
        contactListServiceStub = {
            getContact: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Robert Ward',
                    email: 'Ladonna@ Benson.com',
                    phone: '(891) 411-3124',

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Thomas Franco',
                    email: 'Lila@ Browning.com',
                    phone: '(803) 525-2495',
                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Wood Aguirre',
                    email: 'Alford@ Beard.com',
                    phone: '(862) 433-3136',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ContactComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ContactService, useValue: contactListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ContactComponent);
            contactsList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the contact', () => {
        expect(contactsList.contact.length).toBe(3);
    });

    it('contains a contact with name \'Robert Ward\'', () => {
        expect(contactsList.contact.some((contacts: contact) => contacts.name === 'Robert Ward')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(contactsList.contact.some((contacts: contact) => contacts.name === 'Santa')).toBe(false);
    });

    it('has two contact with email', () => {
        expect(contactsList.contact.filter((contacts: contact) => contacts.email === 'Ladonna@ Benson.com').length).toBe(1);
    });

    it('contact list filters by name', () => {
        expect(contactsList.filteredContact.length).toBe(3);
        contactsList.contactName = 'T';
        contactsList.refreshContact().subscribe(() => {
            expect(contactsList.filteredContact.length).toBe(2);
        });
    });

});

describe('Misbehaving Contact List', () => {
    let contactsList: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;

    let contactListServiceStub: {
        getContact: () => Observable<contact[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        contactListServiceStub = {
            getContact: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ContactComponent],
            providers: [{provide: ContactService, useValue: contactListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ContactComponent);
            contactsList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a contactListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(contactsList.contact).toBeUndefined();
    });
});


describe('Adding a contacts', () => {
    let contactsList: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;
    const newContact: contact = {
        _id: '5ab2bc37e194ff1f2434eb46',
        name: 'test man',
        email: "fefwaefjj@gsfewf.com",
        phone: "1715611615161"
    };
    const newId = 'new_id';

    let calledContact: contact;


    let contactListServiceStub: {
        getContact: () => Observable<contact[]>,
        addNewContact: (newContact: contact) => Observable<{'$oid': string}>
        editContact: (editedContact: contact) => Observable<contact>,
        deleteContact: (id: string) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddContactComponent, any) => {
            afterClosed: () => Observable<contact>
        };
    };

    beforeEach(() => {
        calledContact = null;
        // stub ResourceService for test purposes
        contactListServiceStub = {
            getContact: () => Observable.of([]),
            addNewContact: (contactsToAdd: contact) => {
                calledContact = contactsToAdd;
                return Observable.of({
                    '$oid': newId
                });
            },
            editContact: (editedContact: contact) => {
                calledContact = editedContact;
                return Observable.of(editedContact);
            },
            deleteContact: (id: string) => {
                calledContact = null;
                return Observable.of({
                    '$oid': id
                });
            },
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newContact);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ContactComponent],
            providers: [
                {provide: ContactService, useValue: contactListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ContactComponent);
            contactsList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls ContactService.addContact', () => {
        expect(calledContact).toBeNull();
        contactsList.openDialog();
        expect(calledContact).toEqual(newContact);
    });

    it('calls ContactService.editContact', () => {
        expect(calledContact).toBeNull();
        contactsList.openDialogReview(newContact);
        expect(calledContact).toEqual(newContact);
    });

    it('calls ContactService.deleteContact', () => {
        calledContact = newContact;
        expect(calledContact).toEqual(newContact);
        contactsList.deleteContact(newContact._id);
        expect(calledContact).toBeNull();
    });

    it('updates selected journal when the dialog is closed', () => {
        expect(contactsList.selectedContact).toBeUndefined();
        contactsList.openDialogSelect(); // will 'select' newJournal
        expect(contactsList.selectedContact).toEqual(newContact);
    });

});
