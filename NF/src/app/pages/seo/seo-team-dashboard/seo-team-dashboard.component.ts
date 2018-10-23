
import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { NbThemeService } from '../../../../../node_modules/@nebular/theme';
import * as Chart from 'chart.js'
import { ChartService } from '../../../common/chart/chart.service';
import { ChartConfig } from '../../../common/chart/component/chart/model/chartconfig.model';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';



@Component({
  selector: 'seo-team-dashboard',
  templateUrl: './seo-team-dashboard.component.html',
  styleUrls: ['./seo-team-dashboard.component.scss']
})
export class SeoTeamDashboardComponent implements OnInit {

  d = new Date();
  //fromDate = this.d.setMonth(this.d.getMonth() - 3); //new Date();
  fromDate = new Date("2017-01-02"); //new Date();
  toDate = new Date();
  fromDateforsubReport = new Date();
  toDateforsubReport = new Date();
  websitechart: Chart = [];
  categorychart: Chart = [];
  resourcechart: Chart = [];
  dachart: Chart = [];
  subchart = false;
  showChart = false;
  resources = [];
  resource = "ALL";
  chartview = "DAY";
  chartviews = ["DAY", "MONTH", "YEAR"];
  dateranges = ["Last 24 Hours", "This Week", "Last Week", "This Month", "Last Month", "Custom"];
  daterange = "Last 24 Hours";
  chartConfig: ChartConfig;
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,
    private chartService: ChartService,
    private theme: NbThemeService,
  ) {
    this.getMetaData().then(() => {
      this.onSearch();
    });;
  }
  ngOnInit() {

  }

  onSearch() {
    this.showChart = false;
    var resourceFormData = {
      reportType: 'TEAM_' + this.chartview,
      daterange: this.daterange,
      fromDate: this.fromDate,
      toDate: this.toDate,
      resource: this.resource,
      source: this.resource == 'GSA' ? 'GSA' : 'MANUAL'
    };
    this.service.postData(environment.getBacklinkReportData, resourceFormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          var title = 'Backlink by Resource ';
          var canvas = 'resourcechartcanvas';
          var charttype = 'bar';
          var label = 'BLCR_DATE';
          var data = 'BACNKLINK_COUNT';

          var labelarray = [];
          var dataarray = [];
          res.data.forEach(element => {
            labelarray.push(element[label]);
            dataarray.push(element[data]);
          });
          if (this.commonfunctions.isUndefined(this.resourcechart.data)) {
            this.resourcechart = new Chart(canvas, {
              type: charttype
            });
          }
          this.chartService.updateChart(this.resourcechart, title, labelarray, dataarray, this.onResourceClick, this);
          this.resourcechart.update();


        }
      });
  }
  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters: Filter[] = [{
        name: "module",
        value: "SEO"
      },
      {
        name: "submodule",
        value: "BACKLINK"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);

            this.service.postData(environment.getMetadataFromTable, { dbname: "seo", tablename: "seo_blcr_created_links", columnname: "BLCR_LINK_CREATED_BY" })
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.resources = metadata;

                });

            resolve();
          }
        );
    });
    return promise;
  }
  onResourceClick(event, points) {

    this.chartService.getChartData(event, points).then(clickedData => {
      this.getDates(clickedData[0]).then(() => {
        this.subchart = true;
        this.showChart = true;
        var categoryFormData = {
          reportType: 'CATEGORY',
          fromDate: this.fromDateforsubReport,
          toDate: this.toDateforsubReport,
          resource: this.resource,
          source: 'MANUAL'
        };
        this.service.postData(environment.getBacklinkReportData, categoryFormData).subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              var title = 'Backlink by Category (' + clickedData[0] + ")";
              var canvas = 'categorychartcanvas';
              var charttype = 'bar';
              var label = 'BLML_OFF_PAGE_ACTIVITY';
              var data = 'BACNKLINK_COUNT';

              var labelarray = [];
              var dataarray = [];
              res.data.forEach(element => {
                labelarray.push(element[label]);
                dataarray.push(element[data]);
              });
              if (this.commonfunctions.isUndefined(this.categorychart.data)) {
                this.categorychart = new Chart(canvas, {
                  type: charttype
                });
              }
              this.chartService.updateChart(this.categorychart, title, labelarray, dataarray, this.onCategoryClick, this);
              this.categorychart.update();


            }
          });
        var siteFormData = {
          reportType: 'SITE',
          fromDate: this.fromDateforsubReport,
          toDate: this.toDateforsubReport,
          resource: this.resource,
          source: 'MANUAL'
        };
        this.service.postData(environment.getBacklinkReportData, siteFormData).subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              var title = 'Backlink by Site (' + clickedData[0] + ")";
              var canvas = 'websitechartcanvas';
              var charttype = 'bar';
              var label = 'BLML_SITE';
              var data = 'BACNKLINK_COUNT';
              var labelarray = [];
              var dataarray = [];
              res.data.forEach(element => {
                labelarray.push(element[label]);
                dataarray.push(element[data]);
              });
              if (this.commonfunctions.isUndefined(this.websitechart.data)) {
                this.websitechart = new Chart(canvas, {
                  type: charttype
                });
              }
              this.chartService.updateChart(this.websitechart, title, labelarray, dataarray, this.onSiteClick, this);
              this.websitechart.update();

            }
          });
        var daFormData = {
          reportType: 'DA',
          fromDate: this.fromDateforsubReport,
          toDate: this.toDateforsubReport,
          resource: this.resource,
          source: 'MANUAL'
        };
        this.service.postData(environment.getBacklinkReportData, daFormData).subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              var title = 'Backlink by Domain Authority (' + clickedData[0] + ")";
              var canvas = 'dachartcanvas';
              var charttype = 'bar';
              var label = 'DOMAIN_AUTHORITY';
              var data = 'DA_COUNT';

              var labelarray = [];
              var dataarray = [];
              res.data.forEach(element => {
                labelarray.push(element[label]);
                dataarray.push(element[data]);
              });
              if (this.commonfunctions.isUndefined(this.dachart.data)) {
                this.dachart = new Chart(canvas, {
                  type: charttype
                });
              }
              this.chartService.updateChart(this.dachart, title, labelarray, dataarray, this.onDaClick, this);
              this.dachart.update();
            }
          });
      });

    });

  }
  getDates(data) {
    let promise = new Promise((resolve, reject) => {
      if (this.chartview == "DAY") {
        this.fromDateforsubReport = new Date(data.substring(0, data.indexOf("_")) + " 23:00:00 " + this.commonfunctions.getTimeZone());
        this.toDateforsubReport = new Date(data.substring(0, data.indexOf("_")) + " 23:00:00 " + this.commonfunctions.getTimeZone());
      }
      if (this.chartview == "MONTH") {
        var year = data.substring(0, data.indexOf("_"));
        var month = data.substring(data.indexOf("_")+1,data.length);
        this.fromDateforsubReport = new Date(Date.parse(month +" 1, " + year + " 23:00 EST"));
        this.toDateforsubReport=  new Date(this.fromDateforsubReport.getFullYear(), this.fromDateforsubReport.getMonth() + 1, 0,23,0);
        
   }      
      if (this.chartview == "YEAR") {
        this.fromDateforsubReport = new Date(data  + "-01-01 23:00:00 " + this.commonfunctions.getTimeZone());
        this.toDateforsubReport = new Date(data + "-12-31 23:00:00 " + this.commonfunctions.getTimeZone());
      }
        this.fromDateforsubReport.setDate(this.fromDateforsubReport.getDate() -1 );
        this.toDateforsubReport.setDate(this.toDateforsubReport.getDate() -1 );

      resolve();
    });
    return promise;
  }
  onCategoryClick() {

  }
  onDaClick() {

  }
  onSiteClick() {

  }
}
