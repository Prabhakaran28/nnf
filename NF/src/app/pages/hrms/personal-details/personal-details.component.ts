import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { NbPersonalDetails } from './models/personalDetails';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core'
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { environment } from '../../../../environments/environment';
import { Filter } from '../../../common/http/Models/filter.model';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { NbSpinnerService } from '../../../../../node_modules/@nebular/theme';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})

export class PersonalDetailsComponent implements OnInit {
  @Input() employee_id: string;
  @Output() nextab: EventEmitter<any> = new EventEmitter<any>();

  emp_id: string = "";
  editmode: boolean;
  sequenceTypeVisible:boolean = true;
  personaldetailsform: FormGroup;
  autoCreateUser = [];
  sequenceType = [];
  securityRole = [];
  empIdVisibility = false;
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService) { }
  @ViewChild('firstname') firstnameref: ElementRef;
  getMetaData() {
    let promise = new Promise((resolve, reject) => {


      var filters: Filter[] = [{
        name: "module",
        value: "HRMS"
      },
      {
        name: "submodule",
        value: "EMPLOYEE"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);

            this.commonfunctions.extractMetaData(metadata, 'HRMS', 'EMPLOYEE', 'AUTO_CREATE_USER').then(
              autocreatedata => {
                this.autoCreateUser = autocreatedata[0];
                this.personaldetailsform.patchValue({
                  autoCreateUserControl: autocreatedata[1]
                });
              });
            this.commonfunctions.extractMetaData(metadata, 'HRMS', 'EMPLOYEE', 'SEQUENCE_TYPE').then(
              sequencetypedata => {
                this.sequenceType = sequencetypedata[0];
                this.personaldetailsform.patchValue({
                  sequenceTypeControl: sequencetypedata[1],

                });
              });
              this.service.getData(environment.getRoles)
              .subscribe(
                (securityrole: Res) => {
                  var string = JSON.stringify(securityrole.data);
                  var securityarray = JSON.parse(string);
                  this.securityRole = [];
                  securityarray.forEach(element => {
                    this.securityRole.push(element.SERO_ROLE_NAME);
                  });
                //this.securityRole = securityrole[0].SERO_ID;
                this.personaldetailsform.patchValue({
                  securityRoleControl: this.securityRole[0],

                });
              });
            resolve();

          }
        );
    });
    return promise;
  }

  setEmployeeDetail(emp_id) {
    var filters: Filter[] = [{
      name: "emp_id",
      value: emp_id
    }];
    
    this.service.getDatawithFilters(environment.getPersonalDetails, filters)
      .subscribe(
        (empDetails: Res) => {
          var string = JSON.stringify(empDetails.data);
          var personaldata = JSON.parse(string);
          this.personaldetailsform.setValue({
            empIdControl: emp_id,
            firstnameControl: personaldata[0].EMPH_FIRSTNAME,
            middlenameControl: personaldata[0].EMPH_MIDNAME,
            lastnameControl: personaldata[0].EMPH_LASTNAME,
            emailFormControl: personaldata[0].EMPH_EMAIL,
            dobFormControl: personaldata[0].EMPH_DATEOFBIRTH,
            dojFormControl: personaldata[0].EMPH_DATEOFJOINING,
            loginIdControl: personaldata[0].SEUS_USER_ID,
            sequenceTypeControl: personaldata[0].EMPH_SEQUENCE_TYPE,
            autoCreateUserControl: personaldata[0].EMPH_AUTOCREATE_LOGIN,
            securityRoleControl: personaldata[0].EMPH_DEFAULT_SECURITROLE,
          });
          this.sequenceTypeVisible = false;
        }
      );
  }

  ngOnInit() {
    this.personaldetailsform = new FormGroup({
      empIdControl: new FormControl(),
      sequenceTypeControl: new FormControl(),
      autoCreateUserControl: new FormControl(),
      loginIdControl: new FormControl(),
      securityRoleControl: new FormControl('', Validators.required),
      firstnameControl: new FormControl('', Validators.required),
      middlenameControl: new FormControl(),
      lastnameControl: new FormControl('', [Validators.required]),
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      //dobFormControl: new FormControl('', [Validators.required, Validators.pattern(/^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/)]),
      dobFormControl: new FormControl({ disabled: true }, [Validators.required]),
      dojFormControl: new FormControl({ disabled: true }, [Validators.required]),

    });
    
    this.personaldetailsform.get('sequenceTypeControl').valueChanges.subscribe(

      (sequenceTypeControl: string) => {

        if (sequenceTypeControl === 'AUTO') {
          this.personaldetailsform.get('empIdControl').setValidators([]);
          this.empIdVisibility = false;

        } else {

          this.personaldetailsform.get('empIdControl').setValidators([Validators.required]);
          this.empIdVisibility = true;

        }

        this.personaldetailsform.get('empIdControl').updateValueAndValidity();

      }

    )
    this.getMetaData().then(
      () => {
        this.emp_id = this.employee_id;
        if (!this.commonfunctions.isUndefined(this.employee_id) && this.employee_id != "") {
          this.setEmployeeDetail(this.employee_id);
          this.editmode = true;
        }
      });

  }


  matcher = new MyErrorStateMatcher();
  onSubmit(f) {
    
    if (f.invalid) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    }
    else {
      var formdata = {
        emp_id: this.personaldetailsform.get('empIdControl').value,
        firstname: this.personaldetailsform.get('firstnameControl').value,
        middlename: this.personaldetailsform.get('middlenameControl').value,
        lastname: this.personaldetailsform.get('lastnameControl').value,
        email: this.personaldetailsform.get('emailFormControl').value,
        dob: this.personaldetailsform.get('dobFormControl').value,
        doj: this.personaldetailsform.get('dojFormControl').value,
        sequenceType: this.personaldetailsform.get('sequenceTypeControl').value,
        autoCreateUser: this.personaldetailsform.get('autoCreateUserControl').value,
        securityRole: this.personaldetailsform.get('securityRoleControl').value,
        loginId: this.personaldetailsform.get('loginIdControl').value,
        mode: this.editmode ? 'M': 'C',
      }
      this.service.postData(environment.saveEmpPersonalDetails, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            this.firstnameref.nativeElement.focus();
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", "Personal Details Saved successfully for the EMP ID: " + res.data[0].EMP_ID);
            this.emp_id = res.data[0].EMP_ID;
            this.sequenceTypeVisible = false;
            this.personaldetailsform.patchValue({
              loginIdControl: res.data[0].USER_ID,

            });
            this.nextab.emit(this.emp_id);
          }
        }
      );
    }
  }
}
