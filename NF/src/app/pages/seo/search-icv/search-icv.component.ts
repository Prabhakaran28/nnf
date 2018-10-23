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
@Component({
  selector: 'search-icv',
  templateUrl: './search-icv.component.html',
  styleUrls: ['./search-icv.component.scss']
})
export class SearchIcvComponent implements OnInit {
  dateIdenfiiedFrom = null;
  dateIdenfiiedTo = null;
  backlinkSite = null;
  domainAuthorityTo: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  domainAuthorityFrom: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  rejectionReason: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  category: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  process: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  followFlag: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  status: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  addedByDefualt = "ALL";
  sourceDefualt = "ALL";
  addedBy = [];
  source = [];
  sourceURL = null;
  modifiedby = null;

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
    //hideSubHeader: true,
    columns: {
      BLIC_BACKLINK_SITE: {
        title: 'Backlink Site',
        type: 'custom',
        //filter: false,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/seo/maintainicv",
            linkparam: { blic_id: row.BLIC_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },

      BLIC_DATE_IDENTIFIED: {
        title: 'Date Identified',
        type: 'string',
        //filter: false,
      },
      BLIC_STATUS: {
        title: 'Status',
        type: 'string',
        //filter: false,
      },
      BLIC_CATEGORY: {
        title: 'Category',
        type: 'string',
        //filter: false,
      },
      BLIC_PROCESS: {
        title: 'Process',
        type: 'string',
        //filter: false,
      },
      BLIC_DOMAIN_AUTHORITY: {
        title: 'Domain Authority',
        type: 'string',
        //filter: false,
      },
      BLIC_DOMAIN_SOURCE: {
        title: 'Domain Source',
        type: 'string',
        //filter: false,
      },
      BLIC_DOMAIN_SOURCE_URL: {
        title: 'Source URL',
        type: 'string',
        //filter: false,
      },
      BLIC_FOLLOW_FLAG: {
        title: 'Follow Flag',
        type: 'string',
        //filter: false,
      },
      BLIC_ADDED_BY: {
        title: 'Added By',
        type: 'string',
        //filter: false,
      },
      BLIC_MODIFIED_BY:{
        title: 'Modified By',
        type: 'string',
        //filter: false,
      },
      BLIC_REMARKS: {
        title: 'Remarks',
        type: 'string',
        //filter: false,
      },
      /* BLIC_INDEX: {
         title: 'Index',
         type: 'string',
         filter: false,
       },*/
    },
  };


  tablesource: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,

  ) {
    //this.onSearch();
  }


  onSearch() {
    var formdata;
    formdata = {
      dateIdenfiiedFrom: this.dateIdenfiiedFrom,
      dateIdenfiiedTo: this.dateIdenfiiedTo,
      backlinkSite: this.backlinkSite,
      category: this.category.selectedOption.id,
      process: this.process.selectedOption.id,
      domainAuthorityFrom: (this.domainAuthorityFrom.selectedOption.id == '' || this.domainAuthorityFrom.selectedOption.id == null) ? 0 : this.domainAuthorityFrom.selectedOption.id,
      domainAuthorityTo: (this.domainAuthorityTo.selectedOption.id == '' || this.domainAuthorityTo.selectedOption.id == null) ? 100 : this.domainAuthorityTo.selectedOption.id,
      source: this.sourceDefualt,
      sourceURL: this.sourceURL,
      followFlag: this.followFlag.selectedOption.id,
      addedBy: this.addedByDefualt,
      status: this.status.selectedOption.id,
      modifiedby: this.modifiedby,
    };
    this.service.postData(environment.searchICV, formdata).subscribe(
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
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'DOMAIN_AUTHORITY').then(
              (domainAuthorityFrom: MetaData) => {
                this.domainAuthorityFrom = domainAuthorityFrom;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'DOMAIN_AUTHORITY').then(
              (domainAuthorityTo: MetaData) => {
                this.domainAuthorityTo = domainAuthorityTo;
                this.domainAuthorityTo.selectedOption.id = "100";
                this.domainAuthorityTo.selectedOption.name = "100";
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_STATUS').then(
              (status: MetaData) => {
                this.status = status;

              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'REJECTION_REASON').then(
              (rejectionReason: MetaData) => {
                this.rejectionReason = rejectionReason;
                this.rejectionReason.availableOptions.push({ id: "ALL", name: "ALL" });
                this.rejectionReason.selectedOption.id = "ALL";
                this.rejectionReason.selectedOption.name = "ALL";
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_CATEGORY').then(
              (category: MetaData) => {
                this.category = category;
                this.category.availableOptions.push({ id: "ALL", name: "ALL" });
                this.category.selectedOption.id = "ALL";
                this.category.selectedOption.name = "ALL";

              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_PROCESS').then(
              (process: MetaData) => {
                this.process = process;
                this.process.availableOptions.push({ id: "ALL", name: "ALL" });
                this.process.selectedOption.id = "ALL";
                this.process.selectedOption.name = "ALL";

              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_FOLLOWFLAG').then(
              (followFlag: MetaData) => {
                this.followFlag = followFlag;
                this.followFlag.availableOptions.push({ id: "ALL", name: "ALL" });
                this.followFlag.selectedOption.id = "ALL";
                this.followFlag.selectedOption.name = "ALL";

              });
            var addedByFilters: Filter[] = [{
              name: "metadata",
              value: "BLIC_ADDED_BY"
            },
            ];
            this.service.getDatawithFilters(environment.getICVMetaData, addedByFilters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.addedBy = metadata;
                });
            var sourceFilters: Filter[] = [{
              name: "metadata",
              value: "BLIC_DOMAIN_SOURCE"
            },
            ];

            this.service.getDatawithFilters(environment.getICVMetaData, sourceFilters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.source = metadata;
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
      this.route.queryParams
        .subscribe(params => {
          const message = params['message'];
          if (!this.commonfunctions.isUndefined(message) && message != "") {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
          }
        });
    });


  }


}



