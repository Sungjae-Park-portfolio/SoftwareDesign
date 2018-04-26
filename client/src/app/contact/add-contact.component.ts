import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {contact} from "./contact";
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-add-contact.component',
    templateUrl: 'add-contact.component.html',
})
export class AddContactComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {contact: contact}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
