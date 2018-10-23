import { Injectable } from '@angular/core';
import * as Chart from 'chart.js'
import { Res } from '../http/models/res.model';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../http/services/httpclient.service';
import { ToasterService } from '../../../../node_modules/angular2-toaster';
import { CommonFunctions } from '../service/commonfunctions.service';
import * as  datalabels from 'chartjs-plugin-datalabels';


@Injectable()
export class ChartService {
  backgroundColor = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC",
  ];
  constructor(private service: HttpClientService,
    private toasterService: ToasterService,
    private commonFunctions: CommonFunctions

  ) {

  };

  buildChart(chartname, title, canvas, charttype, servicename, formdata, label, data, onClickfunction, thiscontext) {

    let promise = new Promise((resolve, reject) => {
      this.service.postData(servicename, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonFunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            if (res.data.length > 0) {
              var labelarray = [];
              var dataarray = [];
              res.data.forEach(element => {
                labelarray.push(element[label]);
                dataarray.push(element[data]);
              });

              if (chartname && chartname.data) {
                chartname.data.labels = labelarray;
                chartname.data.datasets = [{ data: dataarray }];
                chartname.options.title = title;
                chartname.update();
              }
              else {
                chartname = new Chart(canvas, {
                  type: charttype,
                  data: {
                    labels: labelarray,
                    datasets: [{
                      label: 'count',
                      data: dataarray,
                      backgroundColor: [
                        "darkturquoise",
                        "steelblue",
                        "cadetblue",
                        "lightblue",
                        "lightsalmon",
                        "teal",
                        "darkseagreen",
                        "khaki",
                        "lightcoral",
                        "lightgray",
                        "coral",
                        "slategray",
                        "gray",
                        "aquamarine",
                        "pink",
                        "lightseagreen"
                      ],
                      /*backgroundColor: palette(['tol', 'qualitative'], dataarray.length).map(function (hex) {
                        return '#' + hex;
                      }),*/
                      borderWidth: 1
                    }]
                  },
                  options: {
                    responsive: true,
                    //display: true,
                    legend: false,
                    onClick: onClickfunction.bind(thiscontext),
                    title: {
                      display: true,
                      text: title,
                    },
                    /*plugins: {
                      datalabels: {
                        display: true,
                      }
                    },*/
                  }
                });
              }
              resolve("success");
            }
          }
        }
      );
      return promise;
    });
  };
  getChartData(event, points) {
    let promise = new Promise((resolve, reject) => {
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

          resolve(returndata);
        }
      }
    });
    return promise;
  };
  getNewData(servicename, formdata, label, data) {
    var returndata = {
      label: [],
      data: [],
    };
    let promise = new Promise((resolve, reject) => {
      this.service.postData(servicename, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonFunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            if (res.data.length > 0) {
              var labelarray = [];
              var dataarray = [];
              res.data.forEach(element => {
                labelarray.push(element[label]);
                dataarray.push(element[data]);
              });
              returndata.label = labelarray;
              returndata.data = dataarray;
              resolve(returndata);
            }
          }
        });
    });
    return promise;
  };
  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  };
  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  };
  updateChart(chart, title, labelarray, dataarray, onClickFunction, thiscontext) {

    chart.data = {
      labels: labelarray,
      datasets: [{
        label: 'count',
        data: dataarray,
        backgroundColor: [
         /* "darkturquoise",
          "steelblue",
          "cadetblue",
          "lightblue",
          "lightsalmon",
          "teal",
          "darkseagreen",
          "khaki",
          "lightcoral",
          "lightgray",
          "coral",
          "slategray",
          "gray",
          "aquamarine",
          "pink",
          "lightseagreen"*/
          "#3366CC",
          "#DC3912",
          "#FF9900",
          "#109618",
          "#990099",
          "#3B3EAC",
          "#0099C6",
          "#DD4477",
          "#66AA00",
          "#B82E2E",
          "#316395",
          "#994499",
          "#22AA99",
          "#AAAA11",
          "#6633CC",
          "#E67300",
          "#8B0707",
          "#329262",
          "#5574A6",
          "#3B3EAC",
        ],
        borderWidth: 1,
        datalabels: {
          display: true,
        },

      }]
    };
    chart.options = {
      responsive: true,
      legend: false,
      onClick: onClickFunction.bind(thiscontext),
      title: {
        display: true,
        text: title,
      },
      datalabels: {
        backgroundColor: function (context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        color: 'white',
        font: {
          weight: 'bold'
        },
        formatter: Math.round
      },

      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
            userCallback: function (label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                return label;
              }

            },
          }
        }],
      },

    };



  }
}
