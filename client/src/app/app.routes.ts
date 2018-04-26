// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ResourcesComponent} from "./resources/resources.component";
import {ReportsComponent} from "./reports/reports.component";

import {JournalListComponent} from './journaling/journal-list.component';

import {GoalsComponent} from "./goals/goals.component";
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'journaling', component: JournalListComponent},
    {path: 'resources', component: ResourcesComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'goals', component: GoalsComponent },
    {path: 'about', component: AboutComponent},
    {path: 'contact', component: ContactComponent},


];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
