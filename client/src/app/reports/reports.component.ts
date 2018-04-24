import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Emoji} from '../emoji';
import {ReportsService} from './reports.service';
import {MatDialog} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {Inject} from '@angular/core';

import * as Chart from 'chart.js';

@Component({
    selector: 'app-reports-component',
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.css'],
})





export class ReportsComponent implements AfterViewInit, OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];
    public userEmail: string = localStorage.getItem('email');

    public prefilteredEmojis: Emoji[];
    public chartEmojis: Emoji[];

    public startDate: any;
    public endDate: any;
    getDate: any;
    canvas: any;
    barCanvas:any;
    ctx: any;
    barctx:any;


    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService) {

    }



//Filters are not include in the shopping, but Song thinks we may need that in the future.
    public filterEmojis(start, end): Emoji[] {

        this.filteredEmojis = this.emojis;


        // Filter by startDate
        if (start != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate >= start;
            });
        }

        // Filter by endDate
        if (end != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate <= end;
            });
        }

        this.prefilteredEmojis = this.filteredEmojis;
        return this.filteredEmojis;
    }

    //get current date
    getdate(): string{
        return Date();
    }

    filterChart(weekday, mood): number {
        this.chartEmojis = this.prefilteredEmojis;
        if(this.chartEmojis == null){
            this.chartEmojis = [];
        }

        // Filter by mood
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;
        });


/*
        // Filter by day of the week
        this.chartEmojis = this.chartEmojis.filter(emoji => {
            return !weekday || emoji.date.indexOf(weekday) !== -1;
        });
*/
        // return number of emojis left after filter
        return this.chartEmojis.length;
    }


    /**<mat-tab label="Line Chart">
     <div id="chartdiv" layout="row" layout-align="center">
     <canvas id="myChart" width="500" height="500"></canvas>
     </div>
     </mat-tab>
     * Starts an asynchronous operation to update the emojis list
     *
     */


    buildChartData() {
        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        let one_daily_totals = {"label":"Frustrated/Angry",
            "data":[
                this.filterChart('Sun', '1'),
                this.filterChart('Mon', '1'),
                this.filterChart('Tue', '1'),
                this.filterChart('Wed', '1'),
                this.filterChart('Thu', '1'),
                this.filterChart('Fri', '1'),
                this.filterChart('Sat', '1')
            ],
            "fill":false,
            "borderColor":"rgb(0, 0, 100)",
            "lineTension":0.1};

        let two_daily_totals = {"label":"Worried/Anxious",
            "data":[
                this.filterChart('Sun', '2'),
                this.filterChart('Mon', '2'),
                this.filterChart('Tue', '2'),
                this.filterChart('Wed', '2'),
                this.filterChart('Thu', '2'),
                this.filterChart('Fri', '2'),
                this.filterChart('Sat', '2')
            ],
            "fill":false,
            "borderColor":"rgb(0, 100, 0)",
            "lineTension":0.1};

        let three_daily_totals = {"label":"Happy/Content/Ecstatic",
            "data":[
                this.filterChart('Sun', '3'),
                this.filterChart('Mon', '3'),
                this.filterChart('Tue', '3'),
                this.filterChart('Wed', '3'),
                this.filterChart('Thu', '3'),
                this.filterChart('Fri', '3'),
                this.filterChart('Sat', '3')
            ],
            "fill":false,
            "borderColor":"rgb(100, 0, 0)",
            "lineTension":0.1};

        let four_daily_totals = {"label":"Meh/Bleh",
            "data":[
                this.filterChart('Sun', '4'),
                this.filterChart('Mon', '4'),
                this.filterChart('Tue', '4'),
                this.filterChart('Wed', '4'),
                this.filterChart('Thu', '4'),
                this.filterChart('Fri', '4'),
                this.filterChart('Sat', '4')
            ],
            "fill":false,
            "borderColor":"rgb(100, 100, 100)",
            "lineTension":0.1};

        let five_daily_totals = {"label":"Unhappy/Sad/Miserable",
            "data":[
                this.filterChart('Sun', '5'),
                this.filterChart('Mon', '5'),
                this.filterChart('Tue', '5'),
                this.filterChart('Wed', '5'),
                this.filterChart('Thu', '5'),
                this.filterChart('Fri', '5'),
                this.filterChart('Sat', '5')
            ],
            "fill":false,
            "borderColor":"rgb(200, 100, 50)",
            "lineTension":0.1};

        return { labels: days, datasets: [

            one_daily_totals,
            two_daily_totals,
            three_daily_totals,
            four_daily_totals,
            five_daily_totals,

        ]};
    }

    buildChart(): void {
        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;
        let data = this.buildChartData();


        let myChart = new Chart(this.ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }


    ngAfterViewInit(): void {
        this.buildChart();
        //       this.buildBar();
    }

    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis();
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }


    ngOnInit(): void {
        this.refreshEmojis();
    }
    isUserLoggedIN(): boolean {
        var email = localStorage.getItem('email');
        return ((email != '') && (typeof email != 'undefined'));
    }
}
