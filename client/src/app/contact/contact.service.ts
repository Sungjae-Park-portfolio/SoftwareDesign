import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {contact} from "./contact";
import {environment} from '../../environments/environment';

import {ContactComponent} from "./contact.component"



@Injectable()
export class ContactService {
    readonly baseUrl: string = environment.API_URL + 'contact';
    private contactUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    addContact(newContact: contact): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        return this.http.post<{'$oid': string}>(this.contactUrl + '/new', newContact, httpOptions);
    }

    getContactById(id: string): Observable<contact> {
        return this.http.get<contact>(this.contactUrl + '/' + id);
    }
    getContact(contactName?: string): Observable<contact[]> {
        if(contactName) {
            return this.http.get<contact[]>(this.contactUrl + '?name=' + contactName);
        }
        return this.http.get<contact[]>(this.contactUrl);
    }
    editContact(editedContact: contact): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(editedContact);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.contactUrl + '/edit', editedContact, httpOptions);
    }

    deleteContact(id: string): Observable<{'$oid': string}>{
        console.log ("here!");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.baseUrl + '/delete/' + id);
        console.log(this.http.delete(this.baseUrl + '/delete/' + id, httpOptions));
        return this.http.delete<{'$oid': string}>(this.contactUrl + '/delete/' + id, httpOptions);
    }
}
