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
  selector: 'disavow-dashboard',
  templateUrl: './disavow-dashboard.component.html',
  styleUrls: ['./disavow-dashboard.component.scss']
})
export class DisavowDashboardComponent implements OnInit {
  
  d = new Date();
  website = "ALL";
  websites = [];
  visiblesource = "";
  websitechart: Chart = [];
  categorychart: Chart = [];
  resourcechart: Chart = [];
  dachart: Chart = [];
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  detailTable = false;
  showChart = false;
  chartConfig: ChartConfig;
  settings = {
    actions: false,
    columns: {
      WEBSITE: {
        title: 'WEBSITE',
        type: 'string',
      },
      DOMAIN: {
        title: 'DOMAIN',
        type: 'string',
      },
      
    },
  };
  detailsource: LocalDataSource = new LocalDataSource();
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
      reportType: 'DISAVOW',
      website: this.website,
      
    };
    this.service.postData(environment.getDisavowReportData, siteFormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          var title = 'Disavow Sites by Source';
          var canvas = 'websitechartcanvas';
          var charttype = 'bar';
          var label = 'BLDV_SOURCE';
          var data = 'BLDV_COUNT';
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
          this.chartService.updateChart(this.websitechart, title, labelarray, dataarray, this.onSourceClick, this);

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
        value: "A"
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
  

  onSourceClick(event, points) {

    this.chartService.getChartData(event, points).then(clickedData => {
      var formData = {
        reportType: 'SOURCE',
        website: this.website,
        source: clickedData[0]
      };
      this.service.postData(environment.getDisavowReportData, formData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.detailTable = true;
            this.detailsource.load(res.data);

          }
        });
    });
  }

}