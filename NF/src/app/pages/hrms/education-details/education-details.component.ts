import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { Filter } from '../../../common/http/Models/filter.model';

@Component({
  selector: 'education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.scss']
})
export class EducationDetailsComponent implements OnInit {
  @Input() employee_id: string;
  @ViewChild('streetAddress1') streetAddress1ref: ElementRef;
  @Output() nextab: EventEmitter<any> = new EventEmitter<any>();
  // Educational Qualification
  public educationForm: FormGroup;
  emp_id: string;
  editmode: boolean;
  deleteddata:any[]=[];
  public onNext(): void {
    this.nextab.emit();
  }
  constructor(
    private _fb: FormBuilder,
    private commonfunctions: CommonFunctions,
    private service: HttpClientService,
    private toasterService: ToasterService
  ) { }
  ngOnEductionInit() {
    this.educationForm = this._fb.group({
      educationRows: this._fb.array([])
    });
  }
  validateEductionForm() {
    this.educationForm = this._fb.group({
      educationRows: this._fb.array([], Validators.required)
    });
  }
  initEducationRows(var_emed_id,var_institutionName, var_locationName, var_degree,
    var_specialization, var_month, var_percentage) {
    return this._fb.group({
      emed_id:[var_emed_id],
      institutionName: [var_institutionName, Validators.required],
      locationName: [var_locationName, Validators.required],
      degree: [var_degree, Validators.required],
      specialization: [var_specialization, Validators.required],
      month: [var_month, Validators.required],
      percentage: [Validators.required, Validators.pattern('[0-9]')]
    });
  }
  //tabs = [ { title: 'Personal Details', active: false }, { title: 'Education Qualification', active: true } ];
  addEducationRow(var_emed_id, var_institutionName, var_locationName, var_degree,
    var_specialization, var_month, var_percentage) {
    const control = <FormArray>this.educationForm.controls['educationRows'];
    control.push(this.initEducationRows(var_emed_id,var_institutionName, var_locationName, var_degree,
      var_specialization, var_month, var_percentage));

  }

  onEducationSave() {
    var formdata = {
      emp_id: this.emp_id,
      education: this.educationForm.controls.educationRows.value.concat(this.deleteddata),
    }
    console.log(formdata);
    this.service.postData(environment.saveEducationDetails, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          //this.streetAddress1ref.nativeElement.focus();
        }
        else {
          this.commonfunctions.showToast(this.toasterService, "success", "Success", "Education Details Saved successfully for the EMP ID: " + this.emp_id);
          this.nextab.emit();
        }
      }
    );
  }
  setEducationDetail(emp_id) {
    var filters: Filter[] = [{
      name: "emp_id",
      value: emp_id
    }];
    this.service.getDatawithFilters(environment.getEducationDetails, filters)
      .subscribe(
        (educationDetails: Res) => {
          var string = JSON.stringify(educationDetails.data);
          var educationdata = JSON.parse(string);
          educationdata.forEach(element => {
            this.addEducationRow(element.EMED_ID,element.EMED_INSTITUTION, element.EMED_ADDRESS, element.EMED_TYPE,
              element.EMED_SPECIALIZATION, element.EMED_MONTHOFPASSING, element.EMED_PERCENTILE);
          });



        }
      );
  }
  onDelete($event){
    const control = <FormArray>this.educationForm.controls['educationRows'];
    var data = $event.value;
    data['flag'] = "D";
    this.deleteddata.push(data);
    control.removeAt($event);
  }
  ngOnInit() {
    this.emp_id = this.employee_id;
    //this.validateEductionForm();
    this.ngOnEductionInit();
    if (!this.commonfunctions.isUndefined(this.employee_id) && this.employee_id != "") {
      this.setEducationDetail(this.employee_id);
      this.editmode = true;
    }
    else {
      this.addEducationRow('','','','','','','');
    }

  }
}
