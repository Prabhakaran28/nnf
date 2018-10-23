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
import { Filter } from '../../../common/http/Models/filter.model';
import { MetaData } from '../../../common/models/metadata.model';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
@Component({
  selector: 'icv-dashboard',
  templateUrl: './icv-dashboard.component.html',
  styleUrls: ['./icv-dashboard.component.scss']
})
export class IcvDashboardComponent implements OnInit {

  d = new Date();
  //fromDate = new Date(this.d.setMonth(this.d.getMonth() - 3)); //new Date();
  fromDate = new Date("2017-01-02"); //new Date();
  toDate = new Date();
  rejectchart: Chart = [];
  websitechart: Chart = [];
  categorychart: Chart = [];
  resourcechart: Chart = [];
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  subchart = false;
  showChart = false;
  showReject = false;
  chartConfig: ChartConfig;
  detailTable = false;
  detailsettings = { actions: false, columns: {} };
  rejectReason = "";
  rejectionReason = "";
  totalSites = null;
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,
    private chartService: ChartService,
    private theme: NbThemeService,
  ) {
    this.getMetaData().then(()=>{
      this.setIcvCount();
      this.onSearch();
  
    });
  }
  ngOnInit() {

  }
  setIcvCount() {

    this.service.getData(environment.getICVCount)
      .subscribe(
        (icvCount: Res) => {
          var string = JSON.stringify(icvCount.data);
          var icvData = JSON.parse(string);
          if (icvCount.return_code == 0) {
            this.totalSites = icvData[0].TOTAL_ICV;
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", icvCount.return_message);
          }
        }
      );
  }
  onSearch() {
    this.showChart = false;
    var resourceFormData = {
      reportType: (this.source.selectedOption.id == 'RESOURCE') ? 'RESOURCE':'STATUS',
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.service.postData(environment.getIcvReportData, resourceFormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          var title = 'Promotional Sites by ' + ((this.source.selectedOption.id == 'RESOURCE') ? 'Resource':'Status');
          var canvas = 'resourcechartcanvas';
          var charttype = 'bar';
          var label = (this.source.selectedOption.id == 'RESOURCE') ? 'BLIC_ADDED_BY':'BLIC_STATUS';
          var data = 'ICV_COUNT';

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
  onResourceClick(event, points) {
    this.chartService.getChartData(event, points).then(clickedData => {
      this.subchart = true;
      this.showChart = true;
      var categoryFormData = {
        reportType: 'CATEGORY',
        fromDate: this.fromDate,
        toDate: this.toDate,
        resource: (this.source.selectedOption.id == 'RESOURCE') ? clickedData[0]:null,
        status: (this.source.selectedOption.id != 'RESOURCE') ? clickedData[0]:null,
      };
      this.service.postData(environment.getIcvReportData, categoryFormData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            var title = 'Promotional Sites by Category (' + clickedData[0] + ")";
            var canvas = 'categorychartcanvas';
            var charttype = 'bar';
            var label = 'BLIC_CATEGORY';
            var data = 'ICV_COUNT';

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
        var DAFormData = {
          reportType: (this.source.selectedOption.id == 'RESOURCE') ? 'DOMAINAUTHORITY':'RESOURCE',
          fromDate: this.fromDate,
          toDate: this.toDate,
          resource: (this.source.selectedOption.id == 'RESOURCE') ? clickedData[0]:null,
          status: (this.source.selectedOption.id != 'RESOURCE') ? clickedData[0]:null,
  
        };
        this.service.postData(environment.getIcvReportData, DAFormData).subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              var title = 'Promotional Sites by ' + ((this.source.selectedOption.id == 'RESOURCE') ? 'Domain Authority':'RESOURCE' +  '(' + clickedData[0] + ")");
              var canvas = 'websitechartcanvas';
              var charttype = 'bar';
              var label = (this.source.selectedOption.id == 'RESOURCE') ? 'DOMAIN_AUTHORITY':'BLIC_ADDED_BY';
              var data = 'ICV_COUNT';
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
              this.chartService.updateChart(this.websitechart, title, labelarray, dataarray, this.onDomainAuthorityClick, this);
              this.websitechart.update();
    
            }
          });
          if(this.source.selectedOption.id != 'RESOURCE'){

         
          this.showReject = true;
          var RejReasonFormData = {
            reportType: 'REJECTION_REASON',
            fromDate: this.fromDate,
            toDate: this.toDate,
            resource: (this.source.selectedOption.id == 'RESOURCE') ? clickedData[0]:null,
            status: (this.source.selectedOption.id != 'RESOURCE') ? clickedData[0]:null,
    
          };
          this.service.postData(environment.getIcvReportData, RejReasonFormData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                var title = 'Promotional Sites by  Recjected Reason' +  '(' + clickedData[0] + ")";
                var canvas = 'rejectchartcanvas';
                var charttype = 'bar';
                var label = 'BLIC_REJECTION_REASON';
                var data = 'ICV_COUNT';
                var labelarray = [];
                var dataarray = [];
                res.data.forEach(element => {
                  labelarray.push(element[label]);
                  dataarray.push(element[data]);
                });
                if (this.commonfunctions.isUndefined(this.rejectchart.data)) {
                  this.rejectchart = new Chart(canvas, {
                    type: charttype
                  });
                }
                this.chartService.updateChart(this.rejectchart, title, labelarray, dataarray, this.onRejectClick, this);
                this.rejectchart.update();
      
              }
            });
          }
          else{
            this.showReject = false;  
          }
    });
  }
  onCategoryClick(event, points) {

  }
  onRejectClick(event, points){
    this.chartService.getChartData(event, points).then(clickedData => {
      this.onClick("V_ICV_REJECT_REASON",clickedData[0]);
    });
  }
  onDomainAuthorityClick() {

  }
  onClick(reportType, rejectReason) {
    this.rejectionReason = rejectReason;
    var formdata;
    formdata = {
      reportType: reportType,
      rejectReason: rejectReason,
    };
    this.detailsource.empty();
    this.service.postData(environment.getIcvReportData, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          var jsonstr = JSON.stringify(res.data);
          var jsonData = JSON.parse(jsonstr);
          var test = {};
          for (var i in jsonData) {
            var key = i;
            var val = jsonData[i];
            for (var j in val) {
              var sub_key = j;
              test[sub_key] = { title: sub_key };
            }
          }

          this.detailTable = true;
          var tempsettings = { actions: false, columns: {} };
          tempsettings.columns = test;
          this.detailsettings = Object.assign({}, tempsettings);
          this.detailsource.load(res.data);
        }

      });
  }
  detailsource: LocalDataSource = new LocalDataSource();
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_DASHBOARD_TYPE').then(
              (source: MetaData) => {
                this.source = source;

              });
            resolve();
          }
        );
    });
    return promise;
  }
}

