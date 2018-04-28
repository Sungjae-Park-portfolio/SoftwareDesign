import {Injectable} from "@angular/core";

@Injectable()
export class AppService {
    constructor() {}

    public isSignedIn(): boolean {
        return (localStorage.getItem('isSignedIn') == 'true');
    }

}
