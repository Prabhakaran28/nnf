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
  selector: 'employment-history',
  templateUrl: './employment-history.component.html',
  styleUrls: ['./employment-history.component.scss']
})
export class EmploymentHistoryComponent implements OnInit {
  @Input() employee_id: string;
  @ViewChild('streetAddress1') streetAddress1ref: ElementRef;
  @Output() nextab: EventEmitter<any> = new EventEmitter<any>();
  // Employment History
  editmode:boolean;
  public employmentForm: FormGroup;
  deleteddata:any[]=[];
  emp_id: string;
  date: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'dd-MM-yyyy',
    defaultOpen: true
  }
  constructor(
    private _fb: FormBuilder,
    private commonfunctions: CommonFunctions,
    private service: HttpClientService,
    private toasterService: ToasterService
  ) { }
  public onNext(): void {
    this.nextab.emit();
  }
  onDelete($event){
    const control = <FormArray>this.employmentForm.controls['employmentRows'];
    var data = $event.value;
    data['flag'] = "D";
    this.deleteddata.push(data);
    control.removeAt($event);
  }
  setEmploymentDetail(emp_id) {
    var filters: Filter[] = [{
      name: "emp_id",
      value: emp_id
    }];
    this.service.getDatawithFilters(environment.getEmploymentDetails, filters)
      .subscribe(
        (employmentDetails: Res) => {
          var string = JSON.stringify(employmentDetails.data);
          var employmentdata = JSON.parse(string);
          employmentdata.forEach(element => {
            this.addEmploymentRow(element.EMEH_ID, element.EMEH_EMPLOYER_NAME, element.EMEH_ADDRESS, element.EMEH_DESIGNATION,
              element.EMEH_SALARY, element.EMEH_STARTDATE, element.EMEH_ENDDATE);
              
          });



        }
      );
  }
  ngOnInit() {
    this.emp_id = this.employee_id;
    this.ngOnEmploymentInit();
    if (!this.commonfunctions.isUndefined(this.employee_id) && this.employee_id != "") {
      this.setEmploymentDetail(this.employee_id);
      this.editmode = true;
    }
    else {
      this.addEmploymentRow('','','','','','','');
    }

  }
  validateEmploymentForm() {
    this.employmentForm = this._fb.group({
      employmentRows: this._fb.array([], Validators.required)
    });
  }
  ngOnEmploymentInit() {
    this.employmentForm = this._fb.group({
      employmentRows: this._fb.array([])
    });
  }

  initEmploymentRows(var_emeh_id,var_employerName,var_location, var_designation,var_salary,var_startdate,var_enddate) {
    return this._fb.group({
      emeh_id:[var_emeh_id],
      employerName: [var_employerName, Validators.required],
      location: [var_location, Validators.required],
      designation: [var_designation, Validators.required],
      salary: [var_salary],
      startdate: [var_startdate, Validators.required],
      enddate: [var_enddate, Validators.required],
    });
  }

  addEmploymentRow(var_emeh_id,var_employerName,var_location, var_designation,var_salary,var_startdate,var_enddate) {
    
    const control = <FormArray>this.employmentForm.controls['employmentRows'];
    control.push(this.initEmploymentRows(var_emeh_id,var_employerName,var_location, var_designation,var_salary,var_startdate,var_enddate));
  }
  onEmploymentSave() {
    var formdata = {
      emp_id: this.emp_id,
      employment: this.employmentForm.controls.employmentRows.value.concat(this.deleteddata),
    }
    this.service.postData(environment.saveEmploymentDetails, formdata).subscribe(
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
}
