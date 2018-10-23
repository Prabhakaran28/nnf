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
  selector: 'seo-resource-dashboard',
  templateUrl: './seo-resource-dashboard.component.html',
  styleUrls: ['./seo-resource-dashboard.component.scss']
})
export class SeoResourceDashboardComponent implements OnInit {

  d = new Date();
  //fromDate = this.d.setMonth(this.d.getMonth() - 3); //new Date();
  fromDate = new Date("2017-01-02"); //new Date();
  toDate = new Date();
  websitechart: Chart = [];
  categorychart: Chart = [];
  resourcechart: Chart = [];
  dachart: Chart = [];
  subchart = false;
  showChart = false;
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  chartConfig: ChartConfig;
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,
    private chartService: ChartService,
    private theme: NbThemeService,
  ) {
    this.getMetaData().then(()=>{
      this.onSearch();
    });;
  }
  ngOnInit() {

  }

  onSearch() {
    this.showChart = false;
    var resourceFormData = {
      reportType: 'RESOURCE',
      fromDate: this.fromDate.setMinutes((this.fromDate.getTimezoneOffset() * -1)),
      toDate: this.toDate,
      source:  this.source.selectedOption.id,
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
          var label = 'BLML_RESOURCE_NAME';
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'BACKLINK_FILE_SOURCE').then(
              (source: MetaData) => {
                this.source = source;
                
              });
            resolve();
          }
        );
    });
    return promise;
  }
  onResourceClick(event, points) {
    this.chartService.getChartData(event, points).then(clickedData => {
      this.subchart = true;
      this.showChart = true;
      var categoryFormData = {
        reportType: 'CATEGORY',
        fromDate: this.fromDate.setMinutes((this.fromDate.getTimezoneOffset() * -1)),
        toDate: this.toDate,
        resource: clickedData[0],
        source:  this.source.selectedOption.id,
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
        fromDate: this.fromDate.setMinutes((this.fromDate.getTimezoneOffset() * -1)),
        toDate: this.toDate,
        resource: clickedData[0],
        source:  this.source.selectedOption.id,
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
          fromDate: this.fromDate.setMinutes((this.fromDate.getTimezoneOffset() * -1)),
          toDate: this.toDate,
          resource: clickedData[0],
          source:  this.source.selectedOption.id,
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
  }
  onCategoryClick() {

  }
  onDaClick(){

  }
  onSiteClick() {

  }
}
