import {Injectable} from "@angular/core";
import {environment} from '../environments/environment';


@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        status = localStorage.getItem('isSignedIn');
        if (status == 'true') { return true;}
        else {return false;}
    }

    public testingToggle(): void {
        //Change this to false to stop the testing set up
        var toggle = false;

        if(!environment.production && toggle){
            localStorage.setItem("userID", "defaultUserID");
            localStorage.setItem("userFirstName", "Patrick");
            localStorage.setItem("userLastName", "Bateman");
            localStorage.setItem("isSignedIn", "true");
        }
    }


}
