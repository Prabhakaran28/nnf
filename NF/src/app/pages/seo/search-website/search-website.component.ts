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
  selector: 'search-website',
  templateUrl: './search-website.component.html',
  styleUrls: ['./search-website.component.scss']
})
export class SearchWebsiteComponent  {
  websitecreateddateto = null;
  websitecreateddatefrom = null;
  website = [];
  category: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  addedByDefualt = "ALL";
  websiteDefault = "ALL";
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
      BLWS_WEBSITE: {
        title: 'Wesbite',
        type: 'custom',
        //filter: false,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/seo/maintainwebsite",
            linkparam: { blws_id: row.BLWS_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },

      BLWS_CATEGORY: {
        title: 'Category',
        type: 'string',
        //filter: false,
      },
      BLWS_CREATED_BY: {
        title: 'Added by',
        type: 'string',
        //filter: false,
      },
      BLWS_CREATED_DTM: {
        title: 'Added Date',
        type: 'string',
        //filter: false,
      },
  }
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
      websitecreateddatefrom: this.websitecreateddatefrom,
      websitecreateddateto: this.websitecreateddateto,
      website: this.websiteDefault,
      category: this.category.selectedOption.id,
      addedBy: this.addedByDefualt,
      modifiedby: this.modifiedby,
    };
    this.service.postData(environment.searchWebsite, formdata).subscribe(
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'WEBSITE', 'WEBSITE_CATEGORY').then(
              (category: MetaData) => {
                this.category = category;
              });

            this.service.postData(environment.getMetadataFromTable, { dbname: "seo", tablename: "seo_blws_website", columnname: "BLWS_CREATED_BY" })
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.addedBy = metadata;

                });

                this.service.postData(environment.getMetadataFromTable, { dbname: "seo", tablename: "seo_blws_website", columnname: "BLWS_WEBSITE" })
                .subscribe(
                  (metaData: Res) => {
                    var string = JSON.stringify(metaData.data);
                    var metadata = JSON.parse(string);
                    this.website = metadata;
  
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



