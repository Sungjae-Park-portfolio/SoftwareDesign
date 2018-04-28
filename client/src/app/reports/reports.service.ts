import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Emoji} from '../emoji';
import {environment} from '../../environments/environment';

@Injectable()
export class ReportsService {
    readonly baseUrl: string = environment.API_URL + 'emojis';
    private emojiUrl: string = this.baseUrl;
    public userID: string = localStorage.getItem('userID');

    constructor(private http: HttpClient) {
    }


    getEmojis(): Observable<Emoji[]> {
        this.filterByUserID(this.userID);
        return this.http.get<Emoji[]>(this.emojiUrl);
    }

    filterByUserID(userID?: string): void {
        if(!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('userID=');
            }
            if (this.emojiUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.emojiUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.emojiUrl += '?userID=' + userID + '&';
            }
        }
        else {
            if (this.parameterPresent('userID=')) {
                let start = this.emojiUrl.indexOf('userID=');
                const end = this.emojiUrl.indexOf('&', start);
                if (this.emojiUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.emojiUrl.indexOf(searchParam) !== -1;
    }

    private removeParameter(searchParam: string) {
        const start = this.emojiUrl.indexOf(searchParam);
        let end = 0;
        if (this.emojiUrl.indexOf('&') !== -1) {
            end = this.emojiUrl.indexOf('&', start) + 1;
        } else {
            end = this.emojiUrl.indexOf('&', start);
        }
        this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end);
    }


}
