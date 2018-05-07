import {Injectable} from "@angular/core";

@Injectable()
export class AppService {
    constructor() {}

    // Checks if a user is signed in.
    // There is a copy of this in home.component.ts as having the home component access it here caused problems with testing
    // As such, any changes made to this function must also be made to the isSignedIn() function in home.component.ts
    public isSignedIn(): boolean {
        return (localStorage.getItem('isSignedIn') == 'true');
    }

}
