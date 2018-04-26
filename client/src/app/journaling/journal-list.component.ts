import {Component, OnInit} from '@angular/core';
import {JournalListService} from './journal-list.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddJournalComponent} from './add-journal.component';
import {EditJournalComponent} from './edit-journal.component';
import {environment} from '../../environments/environment';
import {ViewJournalComponent} from './view-journal.component';

@Component({
    selector: 'app-journal-list-component',
    templateUrl: 'journal-list.component.html',
    styleUrls: ['./journal-list.component.css'],
})

export class JournalListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];
    public userID: string = localStorage.getItem('userID');

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public journalSubject: string;
    public journalBody: string;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalListService into this component.
    constructor(public journalListService: JournalListService, public dialog: MatDialog) {
        if (environment.production === false) {

        }
    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newJournal: Journal = {_id: '', subject: '', body: '', date: null, userID: this.userID};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '500px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.addNewJournal(result).subscribe(
                addJournalResult => {
                    this.highlightedID = addJournalResult;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    openDialogReview(_id: string, subject: string, body: string): void {
        console.log(_id + ' ' + subject);
        const newJournal: Journal = {_id: _id, subject: subject, body: body, date: null, userID: this.userID};
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '500px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.editJournal(result).subscribe(
                editJournalResult => {
                    // this.highlightedID = editJournalResult;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterJournals(searchSubject: string, searchBody: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by subject
        if (searchSubject != null) {
            searchSubject = searchSubject.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchSubject || journal.subject.toLowerCase().indexOf(searchSubject) !== -1;
            });
        }

        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchBody || journal.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        // Sort by date from newest to oldest
        this.filteredJournals = this.filteredJournals.sort((journal1, journal2) => {
            const date1 = new Date(journal1.date);
            const date2 = new Date(journal2.date);
            return date2.valueOf() - date1.valueOf();
        });

        return this.filteredJournals;
    }


    /**
     * Starts an asynchronous operation to update the journals list
     *
     */
    refreshJournals(): Observable<Journal[]> {
        // Get Journals returns an Observable, basically a 'promise' that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals();
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalSubject, this.journalBody);
                this.length = this.filteredJournals.length;
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    /**
     * we might want the server to search for entries instead of angular ?
     loadService(): void {
        this.journalListService.getJournals(this.userCompany).subscribe(
            users => {
                this.users = users;
                this.filteredUsers = this.users;
            },
            err => {
                console.log(err);
            }
        );
    }
     **/

    showJournalBody(journal: Journal): void {
        const newJournal: Journal = {_id: '', subject: journal.subject, body: journal.body,
            date: journal.date, userID: this.userID};
        const dialogRef = this.dialog.open(ViewJournalComponent, {
            width: '80%',
            data: { journal: newJournal },
        });
    }

    getDateString(journal: Journal): string {
        return new Date(journal.date).toDateString();
    }

    ngOnInit(): void {
        this.refreshJournals();
        // this.loadService();
    }

    // This function returns true when the user is signed in and false otherwise
    isUserLoggedIN(): boolean {
        const email = localStorage.getItem('email');
        if(email == '' || email === null) return false;
        else return true;
    }


    /*
    functions for getting next/previous page
     */
    public index = 0;
    public length: number;
    public progress: number;


    prevIndex(): void{

        console.log(this.index + ' index');
        console.log(this.length + ' length');


        if(this.index == 0){
            this.index == 0;
        }
        else if(this.index == this.length - 10){
            this.index = this.index - 10;
        }
        else if(this.index % 10 != 0){
            while(this.index % 10 != 0){
                this.index = this.index - 1;
            }
        }
        else{
            this.index = this.index - 10;
        }
        this.loadProgressBar();
    }

    nextIndex(): void{
        if(this.index + 10 >= this.length){
            this.index = this.length - 1;
        }
        else{
            this.index = this.index + 10;
        }
        this.loadProgressBar();
    }

    firstIndex(): void{
        this.index = 0;
        this.loadProgressBar();
    }

    lastIndex(): void{
        this.index = (this.length- this.length%10) ;
        this.loadProgressBar();
    }

    loadProgressBar(): void {

        this.progress = (this.index / this.length) * 100;
    }

}
