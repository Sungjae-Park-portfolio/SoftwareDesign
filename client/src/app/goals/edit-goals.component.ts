import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from './goals';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-goals.component',
    templateUrl: './edit-goals.component.html',
    styleUrls: ['./edit-goals.component.css'],
})
export class EditGoalComponent {
//    isLinear = true;
//    firstFormGroup: FormGroup;
//    secondFormGroup: FormGroup;
    name = new FormControl('', [Validators.required]);
    category = new FormControl('', [Validators.required]);
    constructor(
        public dialogRef: MatDialogRef<EditGoalComponent>,
        //        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    /*
        ngOnInit() {
            this.firstFormGroup = this._formBuilder.group({
                firstCtrl: ['', Validators.required]
            });
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: ['', Validators.required]
            });
        }
        */

    getNameErrorMessage(){
        return this.name.hasError('required') ? 'You must enter a name' : '';
    }

    getCategoryErrorMessage(){
        return this.category.hasError('required') ? 'You must enter a category' : '';
    }
}
