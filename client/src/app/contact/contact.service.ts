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
    private userID: string = localStorage.getItem('userID');

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
        // Send post request to add a new contact with the contact data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.contactUrl + '/edit', editedContact, httpOptions);
    }

    private parameterPresent(searchParam: string) {
        return this.contactUrl.indexOf(searchParam) !== -1;
    }

    private removeParameter(searchParam: string) {
        const start = this.contactUrl.indexOf(searchParam);
        let end = 0;
        if (this.contactUrl.indexOf('&') !== -1) {
            end = this.contactUrl.indexOf('&', start) + 1;
        } else {
            end = this.contactUrl.indexOf('&', start);
        }
        this.contactUrl = this.contactUrl.substring(0, start) + this.contactUrl.substring(end);
    }


    deleteContact(id: string){
        console.log ("here!");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        if(this.parameterPresent('userID')){
            this.removeParameter('userID');
            let locationOfQuestionMark = this.contactUrl.indexOf('?');
            this.contactUrl = this.contactUrl.substring(0, locationOfQuestionMark) + this.contactUrl.substring(locationOfQuestionMark + 1, this.contactUrl.length)
        }

        console.log(this.baseUrl + '/delete/' + id);
        console.log(id);
        return this.http.delete(this.contactUrl + '/delete/' + id, httpOptions);
    }
}
