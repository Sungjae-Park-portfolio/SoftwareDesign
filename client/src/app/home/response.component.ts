import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {HomeService} from "./home.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent {

    public email: string = localStorage.getItem('email');

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<ResponseComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { response: number }) {
    }

    // getLink is the magic function that randomly chooses one of the links in the array
    // that we added to the responses.component file to make sure the links are not
    // repetitive and random everytime

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
        });
    }

    getLink() : void {
        let service = new HomeService(this.http);
        let response = service.getRandomResponse(this.email);
        response.subscribe(
                (ls) => {
                    window.open(ls[0].link);
                },


            err => {
                if(JSON.stringify(err).includes('Invalid Link')){
                    this.openSnackBar('Oops! There are no response links! Please add some.', 'OK');
                    console.log("Error in getting link");
                }}
        );

        //Make sure dialog box closes after opening link
        this.onNoClick();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
