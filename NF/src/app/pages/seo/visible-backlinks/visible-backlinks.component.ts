import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { LinkElement } from '../../../common/smartable/model/linkelement.model';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';
import { ExportTableComponent } from '../../../common/smartable/component/export-table/export-table.component';

@Component({
  selector: 'visible-backlinks',
  templateUrl: './visible-backlinks.component.html',
  styleUrls: ['./visible-backlinks.component.scss']
})
export class VisibleBacklinksComponent implements OnInit {
  domain = ""
  firstSeenStartDate = null;
  firstSeenEndDate= null;
  link = "";
  lostStartDate = null;
  lostEndDate = null;
  website= "ALL";
  websites = [];
  websitePage = ""
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  createdLink: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  message: string = '';
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
      BLVL_WEBSITE: {
        title: 'Website',
        type: 'string',
        filter: false,
      },
      BLVL_WEBSITE_PAGE: {
        title: 'Website Page',
        type: 'string',
        filter: false,
      },
      BLVL_LINK: {
        title: 'Link',
        type: 'string',
        filter: false,
      },
      BLVL_SOURCE: {
        title: 'Source',
        type: 'string',
        filter: false,
      },
      BLVL_FIRST_SEEN_DATE: {
        title: 'First Seen Date',
        type: 'string',
        filter: false,
      },
      BLVL_LOST_DATE: {
        title: 'Lost Date',
        type: 'string',
        filter: false,
      },
      BLVL_CREATED_LINK: {
        title: 'Created Link',
        type: 'string',
        filter: false,
      }
    },
  };




  tablesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,

  ) {
    
  }
  onStatusChange(id) {
    var value = this.source.availableOptions.filter(value => value.id === id);
    this.source.selectedOption.name = value[0].name;
  }
  onCreatedLinkChange(id) {
    var value = this.createdLink.availableOptions.filter(value => value.id === id);
    this.createdLink.selectedOption.name = value[0].name;
  }

  onSearch() {
    var formdata;
    formdata = {

      domain: this.domain,
      firstSeenStartDate: this.firstSeenStartDate,
      firstSeenEndDate: this.firstSeenEndDate,
      link: this.link,
      lostStartDate: this.lostStartDate,
      lostEndDate: this.lostEndDate,
      website: this.website,
      websitePage: this.websitePage,
      source: this.source.selectedOption.id,
      createdLink: this.createdLink.selectedOption.id,
    };
    this.service.postData(environment.searchVisibleBacklink, formdata).subscribe(
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
              (sourceMetaData: MetaData) => {
                this.source = sourceMetaData;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'VISIBILITY').then(
              (createdLink: MetaData) => {
                this.createdLink = createdLink;
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
  ngOnInit() {
    this.getMetaData().then(() => {
      this.onSearch();
    });
    this.route.queryParams
      .subscribe(params => {
        const message = params['message'];
        if (!this.commonfunctions.isUndefined(message) && message != "") {
          this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
        }
      });

  }


}



