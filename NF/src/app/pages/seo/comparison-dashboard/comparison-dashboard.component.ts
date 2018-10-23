import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from '../../../../../node_modules/angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { ButtonViewComponent } from '../../../common/smartable/component/button-view/button-view.component';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';


@Component({
  selector: 'comparison-dashboard',
  templateUrl: './comparison-dashboard.component.html',
  styleUrls: ['./comparison-dashboard.component.scss']
})
export class ComparisonDashboardComponent implements OnInit {
  @ViewChild('srcWebsite') srcWebsite;
  @ViewChild('tgtWebsite') tgtWebsite;
  @ViewChild('srcSource') srcSource;
  @ViewChild('tgtSource') tgtSource;

  detailTable = false;
  websites = [];
  srcwebsites = [];
  tgtwebsites = [];
  srcSources = [];
  tgtSources = [];
  data = [];
  alldata=[];
  rightonlydata = [];
  leftonlydata = [];
  bothdata = [];
  displays: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  sources: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  ReportType = "";
  settings = {
    actions: false,
    columns: {
      BLVL_SRC_SOURCE: {
        title: 'Left Source',
        type: 'string',

      },
      BLVL_SRC_DOMAIN: {
        title: 'Left Domain',
        type: "string",
      },
      BLVL_TGT_SOURCE: {
        title: 'Right Source',
        type: 'string',

      },
      BLVL_TGT_DOMAIN: {
        title: 'Right Domain',
        type: "string",
      }
    },
  };
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'VISIBLE').then(
              (sources: MetaData) => {
                this.sources = sources;
                var i = -1;
                this.sources.availableOptions.forEach(element => {
                  i++;
                  if (element.id == "ALL") {
                    this.sources.availableOptions.splice(i, 1);
                  }
                });
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'BL_COMPARE_TYPE').then(
              (displays: MetaData) => {
                this.displays = displays;
              });
            this.service.getDatawithFilters(environment.getWebsites, websiteFilters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.websites = metadata;
                  var i = -1;
                  this.websites.forEach(element => {
                    i++;
                    if (element.WEBSITES == "ALL") {
                      this.websites.splice(i, 1);
                    }

                  });

                });
            resolve();
          }
        );
    });
    return promise;
  }

  tablesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService, ) { }

  ngOnInit() {
    this.getMetaData();

  }

  onSearch() {
    var formdata;
    var srcWebsitelist = "";
    var tgtwebsiteslist = "";
    var srcSourceslist = "";
    var tgtSourceslist = "";
    if (this.srcWebsite.selectedOptions.selected.length == 0) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Select at least one website from left side");
      return;
    }
    if (this.srcSource.selectedOptions.selected.length == 0) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Select at least one Source from left side");
      return;
    }
    if (this.tgtWebsite.selectedOptions.selected.length == 0) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Select at least one website from Right side");
      return;
    }
    if (this.tgtSource.selectedOptions.selected.length == 0) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Select at least one website from Right side");
      return;
    }
    this.srcwebsites.forEach(element => {
      if (srcWebsitelist == "") {
        srcWebsitelist = "'" + element + "'";
      }
      else {
        srcWebsitelist = srcWebsitelist + ", '" + element + "'";
      }
    });
    this.srcSources.forEach(element => {
      if (srcSourceslist == "") {
        srcSourceslist = "'" + element + "'";
      }
      else {
        srcSourceslist = srcSourceslist + ", '" + element + "'";
      }
    });
    this.tgtwebsites.forEach(element => {
      if (tgtwebsiteslist == "") {
        tgtwebsiteslist = "'" + element + "'";
      }
      else {
        tgtwebsiteslist = tgtwebsiteslist + ", '" + element + "'";
      }
    });
    this.tgtSources.forEach(element => {
      if (tgtSourceslist == "") {
        tgtSourceslist = "'" + element + "'";
      }
      else {
        tgtSourceslist = tgtSourceslist + ", '" + element + "'";
      }
    });
    formdata = {
      reportType: 'COMPARE',
      src_website: srcWebsitelist,
      src_source: srcSourceslist,
      tgt_website: tgtwebsiteslist,
      tgt_source: tgtSourceslist,
    };
    this.service.postData(environment.getCompareReportData, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.detailTable = true;
          this.data = res.data;
          this.extractData(res.data, "N").then(() => {
            this.updateRows();
          });

        }
      }
    );
  }
  extractData(data, disvow) {
    let promise = new Promise((resolve, reject) => {
      this.rightonlydata = [];
      this.alldata = [];
      this.leftonlydata = [];
      this.bothdata = [];
      data.forEach(element => {
        if (disvow == element.DISAVOWFLAG) {
          this.alldata.push(element);
          if (!this.commonfunctions.isUndefined(element.BLVL_SRC_SOURCE)
            && element.BLVL_SRC_SOURCE != null
            && !this.commonfunctions.isUndefined(element.BLVL_TGT_DOMAIN)
            && element.BLVL_TGT_DOMAIN != null) {
            this.bothdata.push(element);
          }
          else if (!this.commonfunctions.isUndefined(element.BLVL_SRC_SOURCE)
            && element.BLVL_SRC_SOURCE != null) {
            this.leftonlydata.push(element);
          }
          else {
            this.rightonlydata.push(element);
          }
        }
      });
      resolve();
    });
    return promise;
  }
  updateRows() {
    if (this.displays.selectedOption.id == "ALL") {
      this.tablesource.load(this.alldata);
    }
    else if (this.displays.selectedOption.id == "BOTH") {
      this.tablesource.load(this.bothdata);
    }
    else if (this.displays.selectedOption.id == "LEFT SIDE ONLY") {
      this.tablesource.load(this.leftonlydata);
    }
    else if (this.displays.selectedOption.id == "RIGHT SIDE ONLY") {
      this.tablesource.load(this.rightonlydata);
    }
  }
  onReset() {
    this.srcwebsites = [];
    this.tgtwebsites = [];
    this.srcSources = [];
    this.tgtSources = [];
  }
  onSrcWebAll(event) {
    if (event.checked) {
      this.selectAll(this.srcWebsite.options._results);
    }
    else {
      this.srcwebsites = [];
    }
  }
  onTgtWebAll(event) {
    if (event.checked) {
      this.selectAll(this.tgtWebsite.options._results);
    }
    else {
      this.tgtwebsites = [];
    }
  }
  onSrcSrcAll(event) {
    if (event.checked) {
      this.selectAll(this.srcSource.options._results);
    }
    else {
      this.srcSources = [];
    }
  }
  onTgtSrcAll(event) {
    if (event.checked) {
      this.selectAll(this.tgtSource.options._results);
    }
    else {
      this.tgtSources = [];
    }
  }
  selectAll(data: any[]) {
    data.forEach(element => {
      element.selected = true;
    });

  }
  onShowDisvow(event) {

    this.extractData(this.data, (event.checked) ? "Y" : "N").then(() => {
      this.updateRows();
    });
  }
}
