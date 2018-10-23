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
import { NbSpinnerService } from '../../../../../node_modules/@nebular/theme';

@Component({
  selector: 'created-backlinks',
  templateUrl: './created-backlinks.component.html',
  styleUrls: ['./created-backlinks.component.scss']
})
export class CreatedBacklinksComponent implements OnInit {
  websites = [];

  website = "ALL";
  domain = ""
  link = "";
  startdate = null;
  enddate = null;
  keyword = "";
  createdbys = [];
  createdby = "ALL";
  source: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  visible: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
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
      BLCR_DATE: {
        title: 'Created_Date',
        type: 'string',
        filter: false,
      },
      BLCR_WEBSITE: {
        title: 'Website',
        type: 'string',
        filter: false,
      },
      BLCR_SOURCE: {
        title: 'Source',
        type: 'string',
        filter: false,
      },
      BLCR_LINK_CREATED_BY: {
        title: 'Created By',
        type: 'string',
        filter: false,
      },
      BLCR_LINK: {
        title: 'Link',
        type: 'string',
        filter: false,
      },
      BLCR_KEYWORD: {
        title: 'Keyword',
        type: 'string',
        filter: false,
      },
      BLCR_DOMAIN: {
        title: 'Domain',
        type: 'string',
        filter: false,
      },
      BLCR_VISIBLE: {
        title: 'Visible',
        type: 'string',
        filter: false,
      },
      BLCR_SEM_FIRSTSEEN: {
        title: 'SEM Firstseen',
        type: 'string',
        filter: false,
      },
      BLCR_SEM_LOST: {
        title: 'SEM Lost',
        type: 'string',
        filter: false,
      },
      BLCR_MAJESTIC_FIRSTSEEN: {
        title: 'Majest Firstseen',
        type: 'string',
        filter: false,
      },
      BLCR_MAJESTIC_LOST: {
        title: 'Majestic Lost',
        type: 'string',
        filter: false,
      },
      BLCR_AHREF_FIRSTSEEN: {
        title: 'AHREF Firstseen',
        type: 'string',
        filter: false,
      },
      BLCR_AHREF_LOST: {
        title: 'AHREF Lost',
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
  onVisibleChange(id) {
    var value = this.visible.availableOptions.filter(value => value.id === id);
    this.visible.selectedOption.name = value[0].name;
  }

  onSearch() {
    var formdata;
    formdata = {
      "visibilty": this.visible.selectedOption.id,
      "source": this.source.selectedOption.id,
      "website": this.website,
      "domain": this.domain,
      "link": this.link,
      "startdate": this.startdate,
      "enddate": this.enddate,
      "keyword": this.keyword,
      "createdby": this.createdby,
    };
    this.service.postData(environment.searchCreatedBacklink, formdata).subscribe(
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
        value: "I"
      },
      ];

      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'INPUT').then(
              (sourceMetaData: MetaData) => {
                this.source = sourceMetaData;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'VISIBILITY').then(
              (visible: MetaData) => {
                this.visible = visible;
              });
            this.service.getDatawithFilters(environment.getWebsites, websiteFilters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.websites = metadata;
                });

            this.service.postData(environment.getMetadataFromTable, { dbname: "seo", tablename: "seo_blcr_created_links", columnname: "BLCR_LINK_CREATED_BY" })
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.createdbys = metadata;
                  
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



