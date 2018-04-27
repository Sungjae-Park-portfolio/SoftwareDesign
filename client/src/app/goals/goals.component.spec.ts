import {ComponentFixture, TestBed, async} from '@angular/core/testing';


import {GoalsService} from './goals.service';
import {GoalsComponent} from './goals.component';
import {Goal} from './goals';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {AppService} from "../app.service";

describe('Goal list', () => {

    let goals: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    let appServiceStub: {
        isSignedIn: () => boolean;
    };

    beforeEach(() => {
        appServiceStub = {
            isSignedIn: () => true,
        };
        // stub GoalService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    _id: '5aa0b36ecf40cfd384c299fd',
                    userID: '123456',
                    owner: 'Brittany',
                    name: 'Go to bed earlier',
                    body: 'Get it done',
                    category: 'Todo',
                    startDate: 'Wed Dec 24 2014 05:08:39 GMT-0600 (CST)',
                    endDate: 'Thu Dec 03 1992 09:18:58 GMT-0600 (CST)',
                    frequency: 'Everyday',
                    status: true,
                },
                {
                    _id: '5aa0b36e50d6094af8e91aba',
                    userID: '987654',
                    owner: 'Cathleen',
                    name: 'Go to bed earlier',
                    body: 'You can do it',
                    category: 'Health',
                    startDate: 'Fri Nov 28 1975 16:13:36 GMT-0600 (CST)',
                    endDate: 'Tue May 14 1974 08:51:10 GMT-0500 (CDT)',
                    frequency: 'Everyday',
                    status: false,
                },
                {
                    _id: '5aa0b36e3f417437ce3c502a',
                    userID: '456789',
                    owner: 'Martinez',
                    name: 'Get groceries',
                    body: 'Get it done',
                    category: 'Health',
                    startDate: 'Thu Jan 30 1986 09:39:30 GMT-0600 (CST)',
                    endDate: 'Tue Jul 30 2013 18:14:50 GMT-0500 (CDT)',
                    frequency: 'Everyday',
                    status: true,
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            // providers:    [ GoalsService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: GoalsService, useValue: goalsServiceStub, },
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AppService, useValue: appServiceStub},
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goals = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the goals', () => {
        expect(goals.goals.length).toBe(3);
    });

    it('contains a _id named \'5aa0b36ecf40cfd384c299fd\'', () => {
        expect(goals.goals.some((goal: Goal) => goal._id === '5aa0b36ecf40cfd384c299fd')).toBe(true);
    });


    it('doesn\'t contains an _id \'asdfasdfasdf\'', () => {
        expect(goals.goals.some((goal: Goal) => goal._id === 'asdfasdfasdf')).toBe(false);
    });
});

describe('Misbehaving Goals', () => {
    let goals: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    let appServiceStub: {
        isSignedIn: () => boolean;
    };


    beforeEach(() => {

        appServiceStub = {
            isSignedIn: () => true,
        };

        // stub GoalService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: AppService, useValue: appServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goals = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a GoalsService', () => {
        // Since the observer throws an error, we don't expect goals to be defined.
        expect(goals.goals).toBeUndefined();
    });
});


describe('Adding a goal', () => {
    let goals: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal = {
        _id: '5aa0b36e9c7d66070b9231e4',
        userID: '456321',
        owner: 'Enid',
        name: 'Drink more water',
        body: 'There you go',
        category: 'Activity',
        startDate: 'Sun Feb 14 1999 14:50:05 GMT-0600 (CST)',
        endDate: 'Tue Jun 01 2010 05:50:57 GMT-0500 (CDT)',
        frequency: 'Once a year',
        status: false,
    };
    const newId = 'enid_id';

    let calledGoal: Goal;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addNewGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddGoalComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.of([]),
            addNewGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalsServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goals = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));
/*
    // Says function .addGoal does not exist?

    it('calls GoalsService.addGoal in GoalComponent.openDialog()', () => {
        expect(calledGoal).toBeNull();
        goals.openDialog();
        expect(calledGoal).toEqual(newGoal);
    });
*/
});
