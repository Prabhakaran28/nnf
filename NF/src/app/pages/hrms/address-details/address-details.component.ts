import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Filter } from '../../../common/http/Models/filter.model';

@Component({
  selector: 'address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {
  @Input() employee_id: string;
  @ViewChild('streetAddress1') streetAddress1ref: ElementRef;
  @Output() nextab: EventEmitter<any> = new EventEmitter<any>();
  constructor(private commonfunctions: CommonFunctions,
    private service: HttpClientService,
    private toasterService: ToasterService) { }
  emp_id: string;
  editmode: boolean;
  addressdetailsform: FormGroup;
  public onNext(): void {
    this.nextab.emit();
  }
  ngOnInit() {
    this.emp_id = this.employee_id;
    this.addressdetailsform = new FormGroup({
      streetAddress1: new FormControl('', Validators.required),
      streetAddress2: new FormControl(),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      pstreetAddress1: new FormControl('', Validators.required),
      pstreetAddress2: new FormControl(),
      pcity: new FormControl('', [Validators.required]),
      pstate: new FormControl('', [Validators.required]),
      pcountry: new FormControl('', [Validators.required]),
      pzip: new FormControl('', [Validators.required]),
      pphone: new FormControl(),
      cbcopyAddress: new FormControl(false),
    });
    if (!this.commonfunctions.isUndefined(this.employee_id) && this.employee_id != "") {
      this.setAddressDetail(this.employee_id);
      this.editmode = true;
    }
  }
  setAddressDetail(emp_id) {
    var filters: Filter[] = [{
      name: "emp_id",
      value: emp_id
    }];
    this.service.getDatawithFilters(environment.getAddressDetails, filters)
      .subscribe(
        (addressDetails: Res) => {
          var string = JSON.stringify(addressDetails.data);
          var addressdata = JSON.parse(string);
          addressdata.forEach(element => {
            if (element.EMAD_ADDR_TYPE == 'C') {

              this.addressdetailsform.controls['streetAddress1'].setValue(element.EMAD_ADDR1);
              this.addressdetailsform.controls['streetAddress2'].setValue(element.EMAD_ADDR2);
              this.addressdetailsform.controls['city'].setValue(element.EMAD_CITY);
              this.addressdetailsform.controls['state'].setValue(element.EMAD_STATE);
              this.addressdetailsform.controls['country'].setValue(element.EMAD_COUNTRY);
              this.addressdetailsform.controls['zip'].setValue(element.EMAD_ZIP);
              this.addressdetailsform.controls['phone'].setValue(element.EMAD_PHONE);
            }
            else if (element.EMAD_ADDR_TYPE == 'P') {
              this.addressdetailsform.controls['pstreetAddress1'].setValue(element.EMAD_ADDR1);
              this.addressdetailsform.controls['pstreetAddress2'].setValue(element.EMAD_ADDR2);
              this.addressdetailsform.controls['pcity'].setValue(element.EMAD_CITY);
              this.addressdetailsform.controls['pstate'].setValue(element.EMAD_STATE);
              this.addressdetailsform.controls['pcountry'].setValue(element.EMAD_COUNTRY);
              this.addressdetailsform.controls['pzip'].setValue(element.EMAD_ZIP);
              this.addressdetailsform.controls['pphone'].setValue(element.EMAD_PHONE);
            }
          });


        }
      );
  }
  // copy Address Functionality
  copyAddress(f: NgForm) {
    
    if (!this.addressdetailsform.controls.cbcopyAddress.value) {
      this.addressdetailsform.patchValue({
        pstreetAddress1: this.addressdetailsform.controls.streetAddress1.value,
        pstreetAddress2: this.addressdetailsform.controls.streetAddress2.value,
        pstate: this.addressdetailsform.controls.state.value,
        pcity: this.addressdetailsform.controls.city.value,
        pzip: this.addressdetailsform.controls.zip.value,
        pcountry: this.addressdetailsform.controls.country.value,
        pphone: this.addressdetailsform.controls.phone.value,
      });
    }

  }
  onSubmit(f) {
    if (f.invalid) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    }
    else {
      var formdata = {
        address: [{
          emp_id: this.emp_id,
          addr_type: "C",
          streetAddress1: this.addressdetailsform.get('streetAddress1').value,
          streetAddress2: this.addressdetailsform.get('streetAddress2').value,
          state: this.addressdetailsform.get('state').value,
          city: this.addressdetailsform.get('city').value,
          zip: this.addressdetailsform.get('zip').value,
          country: this.addressdetailsform.get('country').value,
          phone: this.addressdetailsform.get('phone').value,
        },
        {
          emp_id: this.emp_id,
          addr_type: "P",
          streetAddress1: this.addressdetailsform.get('pstreetAddress1').value,
          streetAddress2: this.addressdetailsform.get('pstreetAddress2').value,
          state: this.addressdetailsform.get('pstate').value,
          city: this.addressdetailsform.get('pcity').value,
          zip: this.addressdetailsform.get('pzip').value,
          country: this.addressdetailsform.get('pcountry').value,
          phone: this.addressdetailsform.get('pphone').value,
        }]
      };
      this.service.postData(environment.saveAddressDetails, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            this.streetAddress1ref.nativeElement.focus();
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", "Address Details Saved successfully for the EMP ID: " + this.emp_id);
            this.nextab.emit();
          }
        }
      );
    }

  }
}
