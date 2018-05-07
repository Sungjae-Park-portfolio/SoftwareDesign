import {Component, OnInit} from '@angular/core';
import {gapi} from 'gapi-client';
import {environment} from "../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {CrisisButtonComponent} from "./crisis-button.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppService} from "./app.service";

declare var gapi: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [AppService]
})

export class AppComponent implements OnInit {
    title = "Sunshine Journal";

    windowWidth: number;
    windowHeight: number;
    googleAuth;

    constructor(private http: HttpClient, public appService: AppService, public dialog: MatDialog){
    }

    // The function that starts the sign in process
    signIn() {
        //let googleAuth = gapi.auth2.getAuthInstance();
        this.googleAuth = gapi.auth2.getAuthInstance();
        console.log(this.googleAuth);

        this.googleAuth.grantOfflineAccess().then((resp) => {

            localStorage.setItem('isSignedIn', 'true');
            this.sendAuthCode(resp.code);

        });


    }

    // Clears the localStorage of any stored values related to a signed in user.
    // If future versions use more values, those will needed to be added to also be cleared
    signOut() {
        //let googleAuth = gapi.auth2.getAuthInstance();
        this.handleClientLoad();

        this.googleAuth = gapi.auth2.getAuthInstance();

        this.googleAuth.then(() => {
            this.googleAuth.signOut();
            localStorage.setItem('isSignedIn', 'false');
            localStorage.setItem("userID", "");


            window.location.reload();
        })
    }

    // Send the authcode to the server to be verified.
    sendAuthCode(code: string): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
            .subscribe(onSuccess => {
                console.log("Code sent to server");
                console.log('User id: ' + onSuccess["_id"]);
                console.log(onSuccess["FirstName"]);
                console.log(onSuccess["LastName"]);
                localStorage.setItem('isSignedIn', 'true');
                localStorage.setItem("userID", onSuccess["_id"]["$oid"]);
                localStorage.setItem("userFirstName", onSuccess["FirstName"]);
                localStorage.setItem("userLastName", onSuccess["LastName"]);
                location.reload();
            }, onFail => {
                console.log("ERROR: Code couldn't be sent to the server");
            });

    }

    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {

        gapi.client.init({
            // NOTE: This is not the same as your client secret. This is the clientId. This is fine to have publicly on your github. The client secret is NOT!
            'clientId': '1080043572259-h3vk6jgc4skl3uav3g0l13qvlcqpebvu.apps.googleusercontent.com',
            'scope': 'profile email'
        });


    }

    ngOnInit() {
        //Function to set variables to be used in resizing the screen.
        this.windowHeight = window.screen.height;
        this.windowWidth = window.screen.width;
    }

    onResize(event){
        this.windowWidth = event.target.innerWidth;
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(CrisisButtonComponent, {
            width: '500px'
        });
    }

}
