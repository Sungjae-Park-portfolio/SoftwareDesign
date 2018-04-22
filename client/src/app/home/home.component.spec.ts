import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {Emoji} from "../emoji";
import {Observable} from "rxjs/Observable";
import {FormsModule} from "@angular/forms";
import {HomeService} from "./home.service";

describe('Adding an emoji', () => {

    let component: HomeComponent;

    let fixture: ComponentFixture<HomeComponent>;

    const newEmoji: Emoji = {
        _id: '',
        owner: null,
        mood: 3,
        intensity: 1,
        date: null, //date will be created during the test so that it matches what is made in component.addEmoji
        email: null,
    };

    const newId = 'nick_id';

    let calledEmoji: Emoji;

    let homeServiceStub: {
        addEmoji: (newEmoji: Emoji) => Observable<{'$oid': string}>
    };

    let mockMatDialog: {
        open: (ResponseComponent, any) => {
            afterClosed: () => void
        };
    };

    beforeEach(() => {
        calledEmoji = null;
        // stub EmojiService for test purposes
        homeServiceStub = {
            addEmoji: (emojiToAdd: Emoji) => {
                calledEmoji = emojiToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };

        mockMatDialog = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [HomeComponent], // declare the test component
            providers: [
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: HomeService, useValue: homeServiceStub}]
        });

    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls HomeService.addEmoji', () => {
        expect(calledEmoji).toBeNull();

        component.emoji._id = newEmoji._id;
        component.emoji.mood = newEmoji.mood;
        component.emoji.intensity = newEmoji.intensity;
        component.emoji.owner = newEmoji.owner;
        const date = new Date();
        component.addEmoji(); //date for component.emoji is set within this method

        expect(calledEmoji).toEqual(newEmoji);
    });
});

describe('parseSwipeDirection', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;


    let homeServiceStub: {
        addEmoji: (newEmoji: Emoji) => Observable<{'$oid': string}>
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [HomeComponent], // declare the test component
            providers: [
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: HomeService, useValue: homeServiceStub}
        ]});

    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('tests parseSwipeDirection\'s logic', () => {
        expect(component.parseSwipeDirection(1)).toEqual('left');
        component.lastMood = 1;
        expect(component.parseSwipeDirection(5)).toEqual('left');
        expect(component.parseSwipeDirection(1)).toEqual('none');
        component.lastMood = 5;
        expect(component.parseSwipeDirection(1)).toEqual('right');
        component.lastMood = 4;
        expect(component.parseSwipeDirection(1)).toEqual('left');
    });


    it('tests parseEmotionIntensity\'s logic', () => {
        expect(component.parseEmotionIntensity(1, 1)).toEqual('Frustrated');
        expect(component.parseEmotionIntensity(1, 2)).toEqual('Angry');
        expect(component.parseEmotionIntensity(2, 1)).toEqual('Anxious');
        expect(component.parseEmotionIntensity(3, 3)).toEqual('Ecstatic');
        expect(component.parseEmotionIntensity(4, 2)).toEqual('Bleh');
        expect(component.parseEmotionIntensity(5, 1)).toEqual('Unhappy');
    });
});

/*
describe('updateEmojiIntensity', () => {

    let emojiList: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let HomeServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    beforeEach(() => {
        // stub EmojiService for test purposes
        HomeServiceStub = {
            getEmojis: () => Observable.of([
                {
                    _id: "a98ab3747faebe4490d515a",
                    mood: 1,
                    intensity: 1,
                    date: "8/20/2015 20:00",
                    owner: "Ahnaf",
                    email: "ahnaf@gmail.com",
                },
                {

                    _id: "a98ab3747faebe4490d515b",
                    mood: 1,
                    intensity: 2,
                    date: "8/20/2018 20:00",
                    owner: "Chuck",
                    email: "chuck@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515c",
                    mood: 2,
                    intensity: 1,
                    date: "8/23/2018 20:00",
                    owner: "Matt",
                    email: "matt@gmail.com",
                },
                {

                    _id: "a98ab3747faebe4490d515d",
                    mood: 2,
                    intensity: 2,
                    date: "8/20/2018 20:00",
                    owner: "Chuck",
                    email: "chuck@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515e",
                    mood: 3,
                    intensity: 1,
                    date: "8/23/2018 20:00",
                    owner: "Matt",
                    email: "matt@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515f",
                    mood: 3,
                    intensity: 2,
                    date: "8/20/2015 20:00",
                    owner: "Ahnaf",
                    email: "ahnaf@gmail.com",
                },
                {

                    _id: "a98ab3747faebe4490d515g",
                    mood: 3,
                    intensity: 3,
                    date: "8/20/2018 20:00",
                    owner: "Chuck",
                    email: "chuck@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515h",
                    mood: 4,
                    intensity: 1,
                    date: "8/23/2018 20:00",
                    owner: "Matt",
                    email: "matt@gmail.com",
                },
                {

                    _id: "a98ab3747faebe4490d515i",
                    mood: 4,
                    intensity: 2,
                    date: "8/20/2018 20:00",
                    owner: "Chuck",
                    email: "chuck@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515j",
                    mood: 5,
                    intensity: 1,
                    date: "8/23/2018 20:00",
                    owner: "Matt",
                    email: "matt@gmail.com",
                },
                {

                    _id: "a98ab3747faebe4490d515k",
                    mood: 5,
                    intensity: 2,
                    date: "8/20/2018 20:00",
                    owner: "Chuck",
                    email: "chuck@gmail.com",
                },
                {
                    _id: "a98ab3747faebe4490d515l",
                    mood: 5,
                    intensity: 3,
                    date: "8/23/2018 20:00",
                    owner: "Matt",
                    email: "matt@gmail.com",
                },
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [HomeComponent],
            // providers:    [ HomeService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: HomeService, useValue: HomeServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

        it('have 2 intensities if emoji.mood is 1,2,4', () => {
            expect(emojiList.emojis.some((emoji: Emoji) => (emoji.mood === 1 && emoji.intensity === 2))).toBe(true);
        });

        it('have 3 intensities if emoji.mood is 3,5', () => {
            expect(emojiList.emojis.some((emoji: Emoji) => (emoji.mood === 3 && emoji.intensity === 3))).toBe(true);
        });

        it('can not have 3 intensities if emoji.mood is 1,2,4', () => {
            expect(emojiList.emojis.some((emoji: Emoji) => (emoji.mood === 1 && emoji.intensity === 3))).toBe(false);
        });

});
*/
