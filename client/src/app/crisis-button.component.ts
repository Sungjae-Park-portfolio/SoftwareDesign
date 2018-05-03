import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {contact} from "/home/dejon076/IdeaProjects/csci3601/iteration-4-secure-super-group/client/src/app/contact/contact";
import {ContactService} from "/home/dejon076/IdeaProjects/csci3601/iteration-4-secure-super-group/client/src/app/contact/contact.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-crisis-button.component',
    templateUrl: 'crisis-button.component.html'
})

export class CrisisButtonComponent implements OnInit{
    public contact: contact[];
    public contactName: string;
    public filteredContact: contact[];
    public userID: string = localStorage.getItem('userID');

    constructor(public contactService: ContactService, public dialogRef: MatDialogRef<CrisisButtonComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public filterContact(searchName): contact[] {

        this.filteredContact = this.contact;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredContact = this.filteredContact.filter(contact => {
                return !searchName || contact.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        let searchFavorite = "true";
        this.filteredContact = this.filteredContact.filter(contact => {
            return !searchFavorite || contact.favorite.toString().toLowerCase().indexOf(searchFavorite) !== -1;
        });

        return this.filteredContact;
    }

    loadService(): void {
        this.contactService.getContact('').subscribe(
            contact => {
                this.contact = contact;
                this.filteredContact = this.contact;
            },
            err => {
                console.log(err);
            }
        );
    }

    refreshContact(): Observable<contact[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const contactListObservable: Observable<contact[]> = this.contactService.getContact();
        contactListObservable.subscribe(
            contact => {
                this.contact = contact;
                this.filterContact(this.contactName);
            },
            err => {
                console.log(err);
            });
        return contactListObservable;
    }

    ngOnInit(): void {
        this.refreshContact();
    }

}
