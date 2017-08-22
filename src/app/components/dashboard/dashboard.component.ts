import { Component, OnInit } from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';

import { HttpService } from '../../services/http.service';
import { AppDataService } from '../../services/app-data.service';
import { ApiEndpoints } from '../../api-endpoints';
import { Profile, ChartsData, GraphData, MapData } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Dashboard component</h1>
    <form #dateRangeForm="ngForm" novalidate>
      <div class="dateInputGroup">
        <span class="dateInputLabel">From:</span>
        <my-date-picker name="startDate" [options]="myDatePickerOptions" [(ngModel)]="startDate" required></my-date-picker>
      </div>
      <div class="dateInputGroup">
        <span class="dateInputLabel">To:</span>
        <my-date-picker name="endDate" [options]="myDatePickerOptions" [(ngModel)]="endDate" required></my-date-picker>
      </div>
    </form>

    <app-main-chart *ngIf="chartsDataLoaded" [availablePlanTypes]="graphData.available_types" [chartData]="extractMainChartData()"></app-main-chart>
    
    <div class="small-charts-wrapper">
      <app-round-chart [chartID]="'gender'"></app-round-chart>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  profile: Profile = null;
  chartsData: ChartsData = null;
  mapData: MapData = null;
  graphData: GraphData = null;

  // charts data loading status flag. Used for start rendering of the <app-main-chart> component
  chartsDataLoaded: boolean = false;

  mainChart: any = null;
  dates: { profileStart?: Date, from?: Date, to?: Date } = {};

  constructor(private httpService: HttpService, private appDataService: AppDataService) { }

  ngOnInit() {
    const oneMonthAgo = new Date(moment().subtract(1, 'month').format());

    this.profile = this.appDataService.getProfileData();
    this.dates.profileStart = new Date(this.profile.initial_date);
    this.dates.from = new Date((this.dates.profileStart > oneMonthAgo) ? +this.dates.profileStart : +oneMonthAgo);
    this.dates.to = new Date();

    this.appDataService.fetchChartsData(this.dates.from, this.dates.to)
      .subscribe(({chartsData, mapData, graphData }) => {
          this.chartsData = chartsData;
          this.mapData = mapData;
          this.graphData = graphData;
          this.chartsDataLoaded = true;
          console.log(this.chartsData, this.mapData, this.graphData);
        }
      );
  }

  /* creates array of data objects for main chart */
  extractMainChartData(): any[] {
    const dataValues = {};
    const datesDiffInDays = moment(this.dates.to).diff(this.dates.from, 'days') + 1;

    return Array.from(Array(datesDiffInDays).keys()).map(i => {
      const day = moment(this.dates.from).add(i, 'day');
      const dayFormatted = day.format('YYYY-MM-DD');

      this.graphData.available_types.forEach(type => {
        const value = this.graphData.range_report[dayFormatted]
          && this.graphData.range_report[dayFormatted][type]
          && this.graphData.range_report[dayFormatted][type].requests_count || 0;
          dataValues[type] = value;
      });

      return { ...dataValues, date: dayFormatted };
    });
  }


  // myDatePickerOptions: IMyDpOptions = {
  //   dateFormat: 'mmm dd, yyyy',
  //   showSelectorArrow: false,
  //   showClearDateBtn: false
  // };
  // startDate:Object = { 
  //   date: { year: 2018, month: 10, day: 9 }
  // };
  // endDate:Object = { 
  //   date: { year: 2019, month: 10, day: 9 }
  // };
/*-------------------------------------------------------------------------------------------------------------------*/


  // ngOnDestroy() {
  //   this.AmCharts.destroyChart(this.chart);
  // }


}
