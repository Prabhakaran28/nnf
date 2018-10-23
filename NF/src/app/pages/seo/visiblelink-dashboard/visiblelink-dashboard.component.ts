import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { NbThemeService } from '../../../../../node_modules/@nebular/theme';
import * as Chart from 'chart.js';
import * as  datalabels from 'chartjs-plugin-datalabels';
import { ChartService } from '../../../common/chart/chart.service';
import { ChartConfig } from '../../../common/chart/component/chart/model/chartconfig.model';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
@Component({
  selector: 'visiblelink-dashboard',
  templateUrl: './visiblelink-dashboard.component.html',
  styleUrls: ['./visiblelink-dashboard.component.scss']
})
export class VisiblelinkDashboardComponent implements OnInit {
  d = new Date();
  //fromDate = new Date(this.d.setMonth(this.d.getMonth() - 3)); //new Date();
  fromDate = new Date("2017-01-02"); //new Date();
  toDate = new Date();
  website = "ALL";
  websites = [];
  visiblesource = "";
  websitechart: Chart = [];
  categorychart: Chart = [];
  resourcechart: Chart = [];
  dachart: Chart = [];
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  subchart = false;
  showChart = false;
  dataTable = false;
  chartConfig: ChartConfig;
  settings = {
    actions: false,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    attr: {
      // class: 'table table-bordered'
    },
    hideSubHeader: true,
    columns: {
    
      BLCR_LINK: {
        title: 'Backlink',
        type: 'string',
        filter: false,
      },     
      BLCR_DOMAIN: {
        title: 'Published Domain',
        type: 'string',
        filter: false,
      },
    },
  };
  tablesource: LocalDataSource = new LocalDataSource();
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
    var siteFormData = {
      reportType: 'CREATED_SOURCE',
      fromDate: this.fromDate,
      toDate: this.toDate,
      site: this.website,
      source: 'ALL'
    };
    this.service.postData(environment.getBacklinkReportData, siteFormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          var title = 'Backlink by Created Source';
          var canvas = 'websitechartcanvas';
          var charttype = 'bar';
          var label = 'BLCR_SOURCE';
          var data = 'BLCR_COUNT';
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
      var websiteFilters: Filter[] = [{
        name: "websiteType",
        value: "V"
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
            this.service.getDatawithFilters(environment.getWebsites, websiteFilters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.websites = metadata;
                });
            resolve();
          }
        );
    });
    return promise;
  }
  onSiteClick(event, points) {

    this.chartService.getChartData(event, points).then(clickedData => {
      this.subchart = true;
      this.showChart = true;
      var categoryFormData = {
        reportType: 'VISIBLE_SOURCE',
        fromDate: this.fromDate,
        toDate: this.toDate,
        source: clickedData[0],
        site: this.website,
      };
      this.service.postData(environment.getBacklinkReportData, categoryFormData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            var title = 'Backlink by Visible Link (' + clickedData[0] + ")";
            var canvas = 'categorychartcanvas';
            var charttype = 'bar';
            var label = 'BLVL_SOURCE';
            var data = 'BLVL_COUNT';

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
            this.chartService.updateChart(this.categorychart, title, labelarray, dataarray, this.onVisiblelinkClick, this);
            this.categorychart.update();
          }
        });

    });

  }
  onVisiblelinkClick(event, points) {
    this.chartService.getChartData(event, points).then(clickedData => {
      var resourceFormData = {
        reportType: 'VISIBLE_CATEGORY',
        fromDate: this.fromDate,
        toDate: this.toDate,
        site: this.website,
        visiblesource: clickedData[0],
      };
      this.visiblesource = clickedData[0];
      this.service.postData(environment.getBacklinkReportData, resourceFormData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            var title = 'Backlink by Category (' + clickedData[0] + ")";
            var canvas = 'resourcechartcanvas';
            var charttype = 'bar';
            var label = 'BLCR_CATEGORY';
            var data = 'BLVL_COUNT';

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
            this.chartService.updateChart(this.resourcechart, title, labelarray, dataarray, this.onCategoryClick, this);
            this.resourcechart.update();



          }
        });
    });
  }
  onDaClick() {


  }

  onCategoryClick(event, points) {

    this.chartService.getChartData(event, points).then(clickedData => {
      var resourceFormData = {
        reportType: 'VISIBLE_LINKS',
        fromDate: this.fromDate,
        toDate: this.toDate,
        site: this.website,
        visiblesource: this.visiblesource,
        category: clickedData[0]
      };
      this.service.postData(environment.getBacklinkReportData, resourceFormData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.dataTable = true;
            this.tablesource.load(res.data);

          }
        });
    });
  }

}