import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ChartService } from '../../chart.service';
import { ChartConfig } from './model/chartconfig.model';
import * as Chart from 'chart.js'
import { ToasterService } from '../../../../../../node_modules/angular2-toaster';
import { CommonFunctions } from '../../../service/commonfunctions.service';
import { HttpClientService } from '../../../http/services/httpclient.service';
import { environment } from '../../../../../environments/environment';
import { Res } from '../../../http/models/res.model';


@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnChanges {
  @Input() config: ChartConfig;

  @Output() selectedvalue: EventEmitter<any> = new EventEmitter();
  chart: Chart = [];

  constructor(private chartService: ChartService,
    private toasterService: ToasterService,
    private commonFunctions: CommonFunctions,
    private service: HttpClientService,
  ) {

  }
  ngOnChanges() {
    this.buildReport();

  }
  buildReport() {
    this.service.postData(environment.getBacklinkReportData, this.config.formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonFunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          //if (res.data.length > 0)
           {
            var labelarray = [];
            var dataarray = [];
            res.data.forEach(element => {
              labelarray.push(element[this.config.labelColumnName]);
              dataarray.push(element[this.config.dataColumnName]);
            });

            this.chart = new Chart('chartcanvas', {
              type: this.config.charttype,
              data: {
                labels: labelarray,
                datasets: [{
                  label: 'count',
                  data: dataarray,
                  /* backgroundColor: [
                'rgba(255, 99, 132, 1)',
                 'rgba(54, 162, 235, 1)',
                 'rgba(255, 206, 86, 1)',
                     'red',
                     'blue',
                     'green',
                     'yellow',
                   ],*/
                  /*backgroundColor: palette(['tol', 'qualitative'], dataarray.length).map(function (hex) {
                    return '#' + hex;
                  }),*/
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                //display: true,
                legend: true,
                onClick: this.onClick.bind(this),


              },
              title: {
                display: true,
                text: this.config.title,
              },
              /*plugins: {
                datalabels: {
                  display: true,
                }
              },*/
            });
          }
        }
      });
  }
  onClick(event, points) {
    var returndata = []
    // Get current chart
    if (points.length > 0) {
      var chart = points[0]._chart.controller;
      var activePoint = chart.getElementAtEvent(event);
      var activePoints = chart.getElementsAtEvent(event);
      if (activePoint.length > 0) {
        // Get current Dataset
        var dataset = activePoint[0]._datasetIndex;
        //get the internal index of slice in pie chart
        var clickedElementindex = activePoints[0]["_index"];
        //get specific label by index 
        var label = chart.data.labels[clickedElementindex];
        returndata.push(label);

        //get value by index      
        var value = chart.data.datasets[dataset].data[clickedElementindex];
        returndata.push(value);
        this.selectedvalue.emit(returndata);
      }
    }
  };


}
