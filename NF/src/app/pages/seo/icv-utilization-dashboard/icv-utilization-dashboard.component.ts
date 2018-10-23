import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from '../../../../../node_modules/angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { ButtonViewComponent } from '../../../common/smartable/component/button-view/button-view.component';

@Component({
  selector: 'icv-utilization-dashboard',
  templateUrl: './icv-utilization-dashboard.component.html',
  styleUrls: ['./icv-utilization-dashboard.component.scss']
})
export class IcvUtilizationDashboardComponent implements OnInit {
  d = new Date();
  detailTable = false;
  detailsettings = { actions: false, columns: {} };
  fromDate = new Date(this.d.setMonth(this.d.getMonth() - 3)); //new Date();
  toDate = new Date();
  website = "";
  ReportType = "";
  settings = {
    actions: false,
    columns: {
      BLWS_WEBSITE: {
        title: 'Website',
        type: 'string',

      },
      TOTAL_ICV_DOMAINS: {
        title: 'Total ICV Domains',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = "";
            this.ReportType = "Total ICV Domains";
            this.onClick('D_TOTAL_ICV_DOMAINS', null);

          });
        }
      },
      CREATED_BACKLINK_DOMAIN: {
        title: 'Created Backlink Domains',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Created Backlink Domains';
            this.onClick('D_CREATED_BACKLINK_DOMAIN', row.BLWS_WEBSITE);
          });
        }

      },
      CREATED_ICV_DOMAIN_USED: {
        title: 'ICV Domains Used (Created)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'ICV Domains Used (Created)';
            this.onClick('D_CREATED_ICV_DOMAIN_USED', row.BLWS_WEBSITE);
          });
        }

      },
      CREATED_ICV_DOMAIN_UNUSED: {
        title: 'ICV Domains Unused (Created)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType =  'ICV Domains Unused (Created)';
            this.onClick('D_CREATED_ICV_DOMAIN_UNUSED', row.BLWS_WEBSITE);
          });
        }

      },
      CREATED_OTHER_DOMAIN_USED: {
        title: 'Non ICV Domains Used (Created)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Non ICV Domains Used (Created)';
            this.onClick('D_CREATED_OTHER_DOMAIN_USED', row.BLWS_WEBSITE);
          });
        }

      },
      VISIBLE_BACKLINK_DOMAIN: {
        title: 'Visible Backlink Domains',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Visible Backlink Domains';
            this.onClick('D_VISIBLE_BACKLINK_DOMAIN', row.BLWS_WEBSITE);
          });
        }

      },
      VISIBLE_BACKLINK_LOST_DOMAIN: {
        title: 'Lost Domains (Visible)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Lost Domains (Visible)';
            this.onClick('D_VISIBLE_BACKLINK_LOST_DOMAIN', row.BLWS_WEBSITE);
          });
        }

      },
      VISIBLE_ICV_DOMAIN_USED: {
        title: 'ICV Domain Used (Visible)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'ICV Domain Used (Visible)';
            this.onClick('D_VISIBLE_ICV_DOMAIN_USED', row.BLWS_WEBSITE);

          });
        }
      },
      VISIBLE_ICV_DOMAIN_UNUSED: {
        title: 'ICV Domain Unused (Visible)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'ICV Domain Unused (Visible)';
            this.onClick('D_VISIBLE_ICV_DOMAIN_UNUSED', row.BLWS_WEBSITE);

          });
        }
      },
      VISIBLE_OTHER_DOMAIN_USED: {
        title: 'Non ICV Domain Used (Visible)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Non ICV Domain Used (Visible)';
            this.onClick('D_VISIBLE_OTHER_DOMAIN_USED', row.BLWS_WEBSITE);

          });
        }
      },
      VISIBLE_DISAVOW_DOMAIN: {
        title: 'Disavow Domain (Visible)',
        type: "custom",
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe(row => {
            this.website = row.BLWS_WEBSITE;
            this.ReportType = 'Disavow Domain (Visible)';

            this.onClick('D_VISIBLE_DISAVOW_DOMAIN', row.BLWS_WEBSITE);

          });
        }
      }

    },
  };

  onClick(reportType, website) {
    var formdata;
    formdata = {
      reportType: reportType,
      website: website,
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
  tablesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService, ) { }

  ngOnInit() {
    this.onSearch()
  }

  onSearch() {
    var formdata;
    formdata = {
      reportType: 'V_ICV_UTILIZATION'

    };
    this.service.postData(environment.getIcvReportData, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.tablesource.load(res.data);
        }
      }
    );
  }

}
