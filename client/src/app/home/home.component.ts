import {Component, OnInit} from '@angular/core';
import {Emoji} from '../emoji';
import {HomeService} from './home.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ResponseComponent} from "./response.component";
import {Response} from "./response";
import {AddResponseComponent} from "./add-response.component";
import {AppService} from "../app.service";

// Selector will change when we know more

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    public userID: string = localStorage.getItem('userID');
    public userFirstName: string = localStorage.getItem('userFirstName');
    public emoji: Emoji = {_id: '', userID: this.userID,
        ownerFirstName: this.userFirstName, date: null, mood: 3, intensity: 1};
    public response: Response = {_id: '', link: '', userID: this.userID, name: ''};
    public emojis: Emoji[];
    public lastMood = 3;
    public lastIntensity = 1;

    constructor(public homeService: HomeService, public dialog: MatDialog, public snackBar: MatSnackBar) {

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
        });
    }

    public isSignedIn(): boolean {
        return (localStorage.getItem('isSignedIn') == 'true');
    }


    openDialog(): void {
        const response = this.emoji.mood;
        const dialogRef = this.dialog.open(ResponseComponent, {

            data: { response }
        });
    }

    addEmoji(): void {
        const date = new Date();
        this.emoji.date = null;

        this.homeService.addEmoji(this.emoji).subscribe(
            addEmojiResult => {
                console.log('emoji ' + addEmojiResult + ' successfully added');
                this.openSnackBar('Emoji Saved', 'OK');
            },
            err => {
                // This should probably be turned into some sort of meaningful response.
                console.log('There was an error adding the user.');
                console.log('The error was ' + JSON.stringify(err));
                this.openSnackBar('There was an error communicating with the server. Your entry was not saved.', 'OK');
            });

        this.openDialog();

    }

    //This function takes in the mood and intensity, and returns the english interpretation
    //of mood and intensity, which is then displayed in html.
    parseEmotionIntensity(mood: number, intensity: number){
        if(mood == 1){
            if(intensity == 1) {return "Frustrated"}
            else return "Angry"
        }
        else if(mood == 2){
            if(intensity == 1) {return "Anxious"}
            else return "Worried"
        }
        else if(mood == 3){
            if(intensity == 1) {return "Happy"}
            else if(intensity == 2) {return "Content"}
            else return "Ecstatic"
        }
        else if(mood == 4){
            if(intensity == 1) {return "Meh"}
            else return "Bleh"
        }
        else if(mood == 5){
            if(intensity == 1) {return "Unhappy"}
            else if (intensity == 2) {return "Sad"}
            else return "Miserable"
        }

        // If for some reason it gets here..
        return null;
    }

    makeResponseDialog(): void {
        const newResponse: Response =
            {
                _id: '',
                name: '',
                link: '',
                userID: localStorage.getItem('userID'),
            };
        const dialogRef = this.dialog.open(AddResponseComponent, {
            width: '500px',
            data: { response: newResponse }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.homeService.addResponse(result).subscribe(
                addResponseResult => {
                },
                err => {
                    if(JSON.stringify(err).includes('Invalid Link')) {
                        console.log('Didn\'t add the link because it was invalid.');
                        console.log(JSON.stringify(err));
                        this.openSnackBar('Oops! Your link didn\'t work! We couldn\'t add it. Remember \'.com\'', 'OK');
                    }
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the response.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    parseSwipeDirection(mood: number){
        if(mood < this.lastMood) {
            if(mood == 1 && this.lastMood == 5) {
                return "right";
            }
            else if(mood == 5 && this.lastMood == 1) {
                return "left";
            }
            else{
                return "left";
            }
        }
        else if(mood == this.lastMood) {
            return "none";
        }
        else {
            if(mood == 1 && this.lastMood == 5) {
                return "right";
            }
            else if(mood == 5 && this.lastMood == 1) {
                return "left";
            }
            else{
                return "right"
            }
        }

    }

    ngOnInit() {
        this.emoji.userID = localStorage.getItem('userID');
    }


    // This function pertains to mood carousel. It allows for the value of emoji.mood to
    // 'wrap around' back to the start, so that it is in an infinite loop.
    updateEmojiMood(num: number, mood: number, update: boolean){

        if(update)
        {
            //Reset Intensity on each press of "previous" or "next" buttons.
            this.emoji.intensity = 1;

            //Keep Track of last mood.
            this.lastMood = mood;
        }

        var currentNumber = mood;
        currentNumber = currentNumber + num;
        if(currentNumber < 1) currentNumber = 5;
        if(currentNumber > 5) currentNumber = 1;
        return currentNumber;
    }

    // This function pertains to intensity carousel. It allows the value of emoji.intensity to
    // 'wrap around', but due to variable amounts of intensities across emotions, keeps track of
    // which only have 2 total intensities, and 3 total intensities.
    updateEmojiIntensity(num: number, intensity: number, mood: number){

        //Keep Track of last intensity.
        this.lastIntensity = intensity;

        var currentNumber = intensity;
        currentNumber = currentNumber + num;

        // Find which moods have 2 intensities verses 3 intensities.
        switch(mood){
            case 1:
            case 2:
            case 4:
                if(currentNumber < 1) currentNumber = 2;
                else if(currentNumber > 2) currentNumber = 1;
                return currentNumber;

            case 3:
            case 5:
                if(currentNumber < 1) currentNumber = 3;
                else if(currentNumber > 3) currentNumber = 1;
                return currentNumber;
        }
    }
}



