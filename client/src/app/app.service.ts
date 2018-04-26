import {Injectable} from "@angular/core";
import {environment} from '../environments/environment';


@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        return (localStorage.getItem('isSignedIn') == 'true');
    }

    public testingToggle(): void {
        //Change this to false to stop the testing set up
        var toggle = true;


        if(!environment.production && toggle){
            localStorage.setItem("userID", "defaultUserID");
            localStorage.setItem("userFirstName", "Patrick");
            // localStorage.setItem("userLastName", "Batman");
            localStorage.setItem("isSignedIn", "true");
        }
    }


}
