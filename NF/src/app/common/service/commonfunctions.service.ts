
import { Injectable } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClientService } from '../http/services/httpclient.service';


@Injectable()
export class CommonFunctions {
  constructor(

  ) {
    
  }

  isUndefined(value) {
    return typeof value === 'undefined';
  }

  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
  positions: string[] = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
    'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];

  showToast(toasterService: ToasterService, type: string, title: string, body: string) {
    var config;
    var timeoutvalue = 5000;
    var tapToDismissvalue = false;
    if (type == "error") {
      timeoutvalue = 60000;
      tapToDismissvalue = false;
    }
    config = new ToasterConfig({
      positionClass: 'toast-bottom-full-width',
      timeout: timeoutvalue,
      newestOnTop: true,
      tapToDismiss: tapToDismissvalue,
      preventDuplicates: true,
      animation: 'slideUp',
      limit: 5,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: timeoutvalue,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    toasterService.popAsync(toast);
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });

      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  getMetaData(data, modulename, type, subtype) {


    var availableOptions = [];
    var selectedOption = new Object();
    let promise = new Promise((resolve, reject) => {
      try {
        data.forEach(element => {

          if (element.SEMD_MODULE == modulename &&
            element.SEMD_SUB_MODULE == type &&
            element.SEMD_SUBTYPE == subtype) {
            var availableOptionsobj = {
              name: element.SEMD_VALUE,
              id: element.SEMD_CODE
            }
            availableOptions.push(availableOptionsobj);


            if (element.SEMD_DEFUALT == "Y") {
              selectedOption = {
                id: element.SEMD_CODE,
                name: element.SEMD_VALUE,
              }
            }
          }
        });
        var returndata = {
          "availableOptions": availableOptions,
          "selectedOption": selectedOption,
        }
        resolve(returndata);
      }
      catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  extractMetaData(data, modulename, type, subtype) {

    let extracteddata = [];
    let returndata = [];
    let defualtValue;
    let promise = new Promise((resolve, reject) => {
      try {
        data.forEach(element => {
          if (element.SEMD_MODULE == modulename &&
            element.SEMD_SUB_MODULE == type &&
            element.SEMD_SUBTYPE == subtype) {
            extracteddata.push(element.SEMD_VALUE);
            if (element.SEMD_DEFUALT == "Y") {
              defualtValue = element.SEMD_VALUE;
            }
          }
        });
        returndata.push(extracteddata);
        returndata.push(defualtValue);
        resolve(returndata);
      }
      catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  getTimeZone(){
    return "EST";
  }

}