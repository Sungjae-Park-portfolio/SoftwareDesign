import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MatDialog} from "@angular/material/dialog";
import {ContactService} from "./contact.service";
import {Observable} from "rxjs/Observable";
import {contact} from "./contact";


@Component({
    selector: 'app-contact-button.component',
    templateUrl: 'contact-button.component.html',
})
export class ContactButtonComponent implements OnInit{
    public contact: contact[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public contactName: string;
    public filteredContact: contact[];

    constructor(
        public dialogRef: MatDialogRef<ContactButtonComponent>, public contactService: ContactService, public dialog: MatDialog) {
    }

    public filterContact(searchName): contact[] {

        this.filteredContact = this.contact;

        // Filter by name (for future
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredContact = this.filteredContact.filter(contact => {
                return !searchName || contact.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredContact;
    }

    onNoClick(): void {
        this.dialogRef.close();
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
