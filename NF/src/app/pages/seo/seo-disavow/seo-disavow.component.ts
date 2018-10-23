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
  selector: 'seo-disavow',
  templateUrl: './seo-disavow.component.html',
  styleUrls: ['./seo-disavow.component.scss']
})
export class SeoDisavowComponent implements OnInit {
  tablesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,

  ) {
    this.onSearch();
  }
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
      BLDV_DOMAIN: {
        title: 'DISAVOWED DOMAIN',
        type: 'string',
      }
    },
  };
  onSearch() {
    var formdata;
    formdata = {
    };
    this.service.postData(environment.searchDisavow, formdata).subscribe(
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
  ngOnInit() {
  }

}
