import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Goal} from "./goals";
import {GoalsService} from "./goals.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGoalComponent} from "./add-goals.component";
import {EditGoalComponent} from "./edit-goals.component";
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-goals-component',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public goals: Goal[];
    public filteredGoals: Goal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public goalOwner: string;
    public goalStatus: string;
    //public email: string =

    private highlightedID: {'$oid': string} = { '$oid': '' };


    // Inject the GoalListService into this component.
    constructor(public goalsService: GoalsService, public dialog: MatDialog, public snackBar: MatSnackBar) {

    }

    openDialog(): void {
        const newGoal: Goal =
            {
                _id: '',
                name: '',
                owner: '',
                body: '',
                category: 'Other',
                startDate: '',
                endDate: '',
                frequency: '',
                status: false,
                email: localStorage.getItem('email'),
            };
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '500px',
            data: { goal: newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalsService.addGoal(result).subscribe(
                addGoalResult => {
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    openDialogEdit(_id: string, name: string, owner: string, body: string, category: string, startDate: string, endDate: string, frequency: string, email: string, status: boolean): void {
        const newGoal: Goal =
            {
                _id: _id,
                name: name,
                owner: owner,
                body: body,
                category: category,
                startDate: startDate,
                endDate: endDate,
                frequency: frequency,
                status: status,
                email: email,
            };
        const dialogRef = this.dialog.open(EditGoalComponent, {
            width: '500px',
            data: { goal: newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalsService.editGoal(result).subscribe(
                editJournalResult => {
                    this.highlightedID = editJournalResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }


    public filterGoals(searchName, searchStatus): Goal[] {

        this.filteredGoals = this.goals;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchName || goal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        // Filter by goal status
        if (searchStatus != null){
            searchStatus = searchStatus.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchStatus || goal.status.toString().toLowerCase().indexOf(searchStatus) !== -1;
            });
        }

        // Sort by start date from newest to oldest
        this.filteredGoals = this.filteredGoals.sort((goal1, goal2) => {
            const date1 = new Date(goal1.startDate);
            const date2 = new Date(goal2.startDate);
            return date2.valueOf() - date1.valueOf();
        });


        return this.filteredGoals;
    }

    getDateString(goal: Goal, time: string): string {
        if(time == 'start'){
            return new Date(goal.startDate).toDateString();
        }
        else{
            return new Date(goal.endDate).toDateString();
        }

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<Goal[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const goalListObservable: Observable<Goal[]> = this.goalsService.getGoals();
        goalListObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalOwner, this.goalStatus);
            },
            err => {
                console.log(err);
            });
        return goalListObservable;
    }


    ngOnInit(): void {
        this.refreshGoals();
    }

    parseStatus(thing: Boolean){
        if(thing == true) return "Complete";
        else return "Incomplete"
    }

    isUserLoggedIN(): boolean {
        const email = localStorage.getItem('email');
        if(email == '' || email === null) return false;
        else return true;
    }

    editGoal(_id: string, name: string, owner: string, body: string, category: string, startDate: string, endDate: string, frequency: string, email: string, status: boolean) {
        const updatedGoal: Goal = {_id: _id, name: name, owner: owner, body: body, category: category, startDate: startDate, endDate: endDate, frequency: frequency, email: email, status: status};
        this.goalsService.editGoal(updatedGoal).subscribe(
            editGoalResult => {
                this.highlightedID = editGoalResult;
                this.refreshGoals();
            },
            err => {
                console.log('There was an error editing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

}
