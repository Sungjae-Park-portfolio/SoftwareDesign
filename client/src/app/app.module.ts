import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {HomeService} from "./home/home.service";
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {ResourcesComponent} from "./resources/resources.component";
import {AddResourcesComponent} from "./resources/add-resources.component";
import {CustomModule} from './custom.module';
import {AppService} from "./app.service";


import {AddUserComponent} from './users/add-user.component';
import {ResponseComponent} from "./home/response.component";
import {ReportsComponent} from "./reports/reports.component";
import {ReportsService} from "./reports/reports.service";

import {JournalListComponent} from "./journaling/journal-list.component";
import {JournalListService} from "./journaling/journal-list.service";
import {AddJournalComponent} from './journaling/add-journal.component';
import {EditJournalComponent} from "./journaling/edit-journal.component";

import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
import {AddGoalComponent} from "./goals/add-goals.component";
import {ViewJournalComponent} from "./journaling/view-journal.component";

//import {GoogleSignInComponent} from "angular-google-signin";

import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angular4-social-login';
import {AboutComponent} from "./about/about.component";
import {CrisisButtonComponent} from "./crisis-button.component";
import {AddResponseComponent} from "./home/add-response.component";

let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("Facebook-App-Id")
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
        SocialLoginModule,
        MatTabsModule,
        MatCardModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UserListComponent,
        AddUserComponent,
        ResourcesComponent,
        ResponseComponent,
        ReportsComponent,
        JournalListComponent,
        AddJournalComponent,
        AddResponseComponent,
        GoalsComponent,
        AboutComponent,
        AddGoalComponent,
        EditJournalComponent,
        ViewJournalComponent,
        AddResourcesComponent,
        CrisisButtonComponent,
        // GoogleSignInComponent,

    ],
    providers: [
        UserListService,
        HomeService,
        ReportsService,
        GoalsService,
        JournalListService,
        AppService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
      AddUserComponent,
        ResponseComponent,
        AddGoalComponent,
        AddJournalComponent,
        EditJournalComponent,
        ViewJournalComponent,
        AddResourcesComponent,

        ViewJournalComponent,
        CrisisButtonComponent,
        //add resource component would go here//
        AddResponseComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
