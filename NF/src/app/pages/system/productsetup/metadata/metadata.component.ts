import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { SmartableLinkcolumnComponent } from '../../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { LinkElement } from '../../../../common/smartable/model/linkelement.model';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MetaData } from '../../../../common/models/metadata.model';
import { Filter } from '../../../../common/http/Models/filter.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {

  websites: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  settings = {
    actions: {
      add: false, edit: false, delete: true, position: 'right'
    },
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
    columns: {
      SEMD_ID: {
        title: 'SEMD_ID',
        type: 'number',
      },
      SEMD_MODULE: {
        title: 'Module',
        type: 'string',
      },
      SEMD_SUB_MODULE: {
        title: 'Sub Module',
        type: 'string',
      },
      SEMD_TYPE: {
        title: 'Type',
        type: 'string',
      },
      SEMD_SUBTYPE: {
        title: 'Sub Type',
        type: 'string',
      },
      SEMD_VALUE: {
        title: 'Sub Value',
        type: 'string',
      }
    },
  };
  source: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService, private activeModal: NgbActiveModal,
    private router: Router,
     ) {     
      this.getMetaDataList();
     
    }
    
    getMetaDataList() {
      this.service.getData(environment.getMetaDataList)
        .subscribe(
          (modules:any[]) =>  {
            this.source.load(modules);
          }
        );
    }
    onDelete(event): void {
      //this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
      if (window.confirm('Are you sure you want to delete?')) {
        
       
            var formData = {
              "SEMD_ID": event.data.SEMD_ID,
            };
            this.service.postData(environment.deleteMetaData, formData).subscribe(
              (res: Res) => {
                if (res.return_code != 0) {
                  this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
                  event.confirm.reject();
                  return;
                }
                else {
                  this.commonfunctions.showToast(this.toasterService, "success", "Success", "Document deleted successfully");
                  event.confirm.resolve(event);
                }
              }
            );
          
      } else {
        event.confirm.reject();
      }
    }
  ngOnInit() {
  }

}
