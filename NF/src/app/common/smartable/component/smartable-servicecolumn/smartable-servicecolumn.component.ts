
import { Cell, DefaultEditor, Editor, ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';
import { LinkElement } from '../../model/linkelement.model';
import { HttpClientService } from '../../../http/services/httpclient.service';
import { CommonFunctions } from '../../../service/commonfunctions.service';
import { ToasterService } from 'angular2-toaster';
import { Res } from '../../../http/models/res.model';
import { environment } from '../../../../../environments/environment';

@Component({
  template: `
  <button (click)="download(filepath)" ><i class = "fa fa-download"></i></button>
`,
})
export class SmartableServicecolumnComponent implements OnInit {
  @Input() value: string;
  @Input() rowData: any;

constructor(private service: HttpClientService,
  private commonfunctions: CommonFunctions,
  private toasterService: ToasterService){}

   filepath = ""
    fileName: string;
  ngOnInit() {
    var string = JSON.stringify(this.value);
    var json = JSON.parse(string);
    this.filepath = json.FILE_LOCATION;
    this.fileName=json.FILE_NAME;
   };
  download(filepath) {
    let formData = {filepath: filepath};
    this.service.postData(environment.getAttachmentContent, formData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          return;
        }
        else {
          var blob = new Blob([res.data], { type: 'text/csv' });
          var url= window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = `${this.fileName}`;
          a.click();
          this.commonfunctions.showToast(this.toasterService, "success", "Success", "Document downloaded successfully");
        }
      }
    );
  }
}


