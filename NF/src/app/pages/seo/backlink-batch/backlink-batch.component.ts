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
  selector: 'backlink-batch',
  templateUrl: './backlink-batch.component.html',
  styleUrls: ['./backlink-batch.component.scss']
})
export class BacklinkBatchComponent implements OnInit {
  

    batchid: null;
    fromenddate: null;
    toEndDate: null;
    fromStartDate: null;
    toStartDate: null;
    website: null;
    error: null;

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
    hideSubHeader: true,
    columns: {
      BLBS_ID: {
        title: 'Batch ID',
        type: 'string',
        filter: false,
      },
      BLBS_STARTTIME: {
        title: 'Start Time',
        type: 'string',
        filter: false,
      },
      BLBS_ENDDTIM: {
        title: 'End Time',
        type: 'string',
        filter: false,
      },
      BLBS_STATUS: {
        title: 'Status',
        type: 'string',
        filter: false,
      },
      BLBS_ERROR_DESCRIPTION: {
        title: 'Error Description',
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
  onBatchStart(){
   
    this.service.getData(environment.processFiles).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.commonfunctions.showToast(this.toasterService, "success", "success", res.return_message);
          this.onSearch();
        }
      }
    );
  }
  onSearch() {
    var formdata;
    formdata = {
      blbs_id: this.batchid,
      fromEndTime: this.fromenddate,
      toEndTime: this.toEndDate,
      fromStarttime: this.fromStartDate,
      toStarttime: this.toStartDate,
      errorDescripiton: this.error,
      status : this.status.selectedOption.id,
    };
    this.service.postData(environment.searchBacklinkBatch, formdata).subscribe(
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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'BATCHSTATUS').then(
              (status: MetaData) => {
                this.status = status;
              });
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



