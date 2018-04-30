import {Component} from '@angular/core';
import {AppService} from "../app.service";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    public title: string;

    constructor(public appService: AppService) {
        this.title = 'Resources';
    }

}
