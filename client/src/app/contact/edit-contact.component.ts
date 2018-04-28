import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {contact} from "./contact";
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-edit-contact.component',
    templateUrl: 'edit-contact.component.html',
})

export class EditContactComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<EditContactComponent>,
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
