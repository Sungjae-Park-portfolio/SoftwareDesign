import {Component} from '@angular/core';

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    public title: string;

    constructor() {
        this.title = 'Resources';
    }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    // This function returns true when the user is signed in and false otherwise
    isUserLoggedIN(): boolean {
        const email = localStorage.getItem('email');
        if(email == '' || email === null) return false;
        else return true;
    }

}
