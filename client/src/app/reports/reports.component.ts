import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from "../emoji";
import {ReportsService} from "./reports.service";

@Component({
    selector: 'app-reports-component',
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.css'],
})

export class ReportsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];
    public userEmail: string = localStorage.getItem('email');

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiOwner: string;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService) {

    }


    public filterEmojis(searchDate): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Sort by date
        this.filteredEmojis = this.filteredEmojis.sort((emoji1, emoji2) => {
            const date1 = new Date(emoji1.date);
            const date2 = new Date(emoji2.date);
            return date2.valueOf() - date1.valueOf();
        });


        return this.filteredEmojis;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */
    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis();
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.emojiOwner);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }

    parseEmojiDate(emoji: Emoji): string {
        return new Date(emoji.date).toDateString();
    }

    ngOnInit(): void {
        this.refreshEmojis();
    }

    isUserLoggedIN(): boolean {
        const email = localStorage.getItem('email');
        if(email == '' || email === null) return false;
        else return true;
    }
}
