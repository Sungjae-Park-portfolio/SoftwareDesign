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

    constructor(private http: HttpClient,public appService: AppService, public dialog: MatDialog){
    }


    isUserLoggedIN(): boolean {
        const email = localStorage.getItem('email');
        if(email == '' || email === null) return false;
        else return true;
    }

    signIn() {
        //let googleAuth = gapi.auth2.getAuthInstance();
        this.googleAuth = gapi.auth2.getAuthInstance();
        console.log(this.googleAuth);

        this.googleAuth.grantOfflineAccess().then((resp) => {

            localStorage.setItem('isSignedIn', 'true');
            this.sendAuthCode(resp.code);

        });


    }

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

    sendAuthCode(code: string): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
            .subscribe(onSuccess => {
                console.log("Code sent to server");
                console.log('User id: ' + onSuccess["_id"]["$oid"]);
                console.log(onSuccess["FirstName"]);
                console.log(onSuccess["LastName"]);
                localStorage.setItem("userID", onSuccess["_id"]["$oid"]);
                localStorage.setItem("userFirstName", onSuccess["FirstName"]);
                localStorage.setItem("userLastName", onSuccess["LastName"]);

                // window.location.reload();
            }, onFail => {
                console.log("ERROR: Code couldn't be sent to the server");
            });

    }

    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {

        gapi.client.init({
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
