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
import { NbSpinnerService } from '../../../../../node_modules/@nebular/theme';

@Component({
  selector: 'search-backlink',
  templateUrl: './search-backlink.component.html',
  styleUrls: ['./search-backlink.component.scss']
})
export class SearchBacklinkComponent implements OnInit {

  batch = {
    batchid: null,
    status: null,
    startdate: null,
    enddate: null,
    website: null,
  };

  status: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
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
      BLBF_FILE_NAME: {
        title: 'File Name',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/seo/uploadbacklink",
            linkparam: { blbf_id: row.BLBF_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },
     /* BLVF_WEBSITE: {
        title: 'Website',
        type: 'string',
        filter: false,
      },*/
      BLBF_CREATED_DTM: {
        title: 'Created Date',
        type: 'string',
        filter: false,
      },
      BLBF_FILE_TYPE: {
        title: 'File Type',
        type: 'string',
        filter: false,
      },
     /* BLBF_FILE_NAME: {
        title: 'File Name',
        type: 'string',
        filter: false,
      },*/
      BLBF_STATUS: {
        title: 'Status',
        type: 'string',
        filter: false,
      },
    },
  };


  source: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,

  ) {
    this.onSearch();
  }
  onStatusChange(id) {
    var value = this.status.availableOptions.filter(value => value.id === id);
    this.status.selectedOption.name = value[0].name;
  }

  onSearch() {
    
    var formdata;
    this.batch.status = this.status.selectedOption.id;
    this.batch.website = null;
    formdata = {
      "batch": this.batch,
    };
    this.service.postData(environment.searchBacklink, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.source.load(res.data);
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'STATUS').then(
              (status: MetaData) => {
                this.status = status;
              });
            /*this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'WEBSITE').then(
              (websites: MetaData) => {
                this.websites = websites;
              });*/
            resolve();
          }
        );
    });
    return promise;
  }
  ngOnInit() {
    this.getMetaData();
    this.route.queryParams
      .subscribe(params => {
        const message = params['message'];
        if (!this.commonfunctions.isUndefined(message) && message != "") {
          this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
        }
      });

  }


}



