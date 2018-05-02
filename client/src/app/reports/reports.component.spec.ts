import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ReportsComponent} from "./reports.component";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {ReportsService} from "./reports.service";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Emoji} from "../emoji";
import {AppService} from "../app.service";

describe('Reports list', () => {

    let emojiList: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    let ReportsListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    let appServiceStub: {
        isSignedIn: () => boolean
    };

    beforeEach(() => {
        // stub ReportsService for test purposes
        ReportsListServiceStub = {
            getEmojis: () => Observable.of([
                {
                    _id: 'f',
                    userID: '123456',
                    ownerFirstName: 'Roch',
                    owner: 'Nick',
                    mood: 3,
                    intensity: 1,
                    date: null, //date will be created during the test so that it matches what is made in component.addEmoji
                },
                {
                    _id: 'd',
                    userID: '987654',
                    ownerFirstName: 'Sungjae',
                    owner: 'Roch',
                    mood: 4,
                    date: null, //date will be created during the test so that it matches what is made in component.addEmoji
                    intensity: 2,
                },
                {
                    _id: 'd',
                    userID: '456321',
                    ownerFirstName: 'Steve',
                    owner: 'Leo',
                    mood: 5,
                    date: null, //date will be created during the test so that it matches what is made in component.addEmoji
                    intensity: 2,
                }
            ])
        };

        appServiceStub = {
            isSignedIn: () => true,
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ReportsComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ReportsService, useValue: ReportsListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AppService, useValue: appServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportsComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the emojis', () => {
        expect(emojiList.emojis.length).toBe(3);
    });

    it('contains a owner named \'Roch\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.ownerFirstName === 'Roch')).toBe(true);
    });

    it('contain a user named \'Sungjae\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.ownerFirstName === 'Roch')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.ownerFirstName === 'Santa')).toBe(false);
    });

    it('has one emoji with the owner Steve', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.ownerFirstName === 'Steve').length).toBe(1);
    });

    it('has two emoji with intensity two', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.intensity === 2).length).toBe(2);
    });

    it('has one emoji with mood four', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.mood === 4).length).toBe(1);
    });

});

describe('Misbehaving Emoji List', () => {
    let emojiList: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    let emojiListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    let appServiceStub: {
        isSignedIn: () => boolean
    };

    beforeEach(() => {
        // stub UserService for test purposes
        emojiListServiceStub = {
            getEmojis: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        appServiceStub = {
            isSignedIn: () => true
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ReportsComponent],
            providers: [{provide: ReportsService, useValue: emojiListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AppService, useValue: appServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportsComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    // it('generates an error if we don\'t set up a UserListService', () => {
    //     // Since the observer throws an error, we don't expect users to be defined.
    //     expect(emojiList.emojis).toBeUndefined();
    // });
});



