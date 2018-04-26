import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
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
        userID: '',
        ownerFirstName: null,
        mood: 3,
        intensity: 1,
        date: null, //date will be created during the test so that it matches what is made in component.addEmoji
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
        component.emoji.userID = newEmoji.userID;
        component.emoji.mood = newEmoji.mood;
        component.emoji.intensity = newEmoji.intensity;
        component.emoji.ownerFirstName = newEmoji.ownerFirstName;
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

