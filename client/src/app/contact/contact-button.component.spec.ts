import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {contact} from "./contact";
import {ContactComponent} from "./contact.component";
import {ContactService} from "./contact.service";
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
        // stub ResourceService for test purposes
        contactListServiceStub = {
            getContact: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Robert Ward',
                    userID: '258771',
                    phone: '(891) 411-3124',

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Thomas Franco',
                    userID: '258993',
                    phone: '(803) 525-2495',
                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Wood Aguirre',
                    userID: '122586',
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
        expect(contactsList.contact.some((contactNumber: contact) => contactNumber.name === 'Robert Ward')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(contactsList.contact.some((contactNumber: contact) => contactNumber.name === 'Santa')).toBe(false);
    });

    it('has two contact with userID', () => {
        expect(contactsList.contact.filter((contactNumber: contact) => contactNumber.userID === '258771').length).toBe(1);
    });

});
