
import { Injectable } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { CommonFunctions } from '../../service/commonfunctions.service';
import { isUndefined } from 'util';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Injectable()
export class SmartTable {
    constructor() { }
    getDisplayedDataFromSource(source: LocalDataSource, settings:{}) {
        let data = [];
        let promise = new Promise((resolve, reject) => {
            try {
                source.getAll().then(value => {
                    value.forEach(element => {
                        data.push(element);
                    });
                });
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        });
        return promise;


    }
    getDataFromSource(source: LocalDataSource) {
        let data = [];
        let promise = new Promise((resolve, reject) => {
            try {
                source.getAll().then(value => {
                    value.forEach(element => {
                        data.push(element);
                    });
                });
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        });
        return promise;


    }

    public getNewRows = (sourceDS: LocalDataSource
        , newDS: LocalDataSource
        , keycolumn: string): Observable<any[]> => {
        var obs = Observable.fromPromise(
            newDS.getAll().then(value => {
                var data = [];
                value.forEach(elements => {
                    elements.forEach(element => {
                        var exists = false;
                        sourceDS.getAll().then(tablevalue => {
                            tablevalue.forEach(tableelement => {
                                if (!exists && element[keycolumn] == tableelement[keycolumn]) {
                                    exists = true;
                                }
                            });
                            if (!exists) {
                                element.FLAG = 'I';
                                data.push(element);
                            }
                        });

                    });

                });
                return data;
            }));
        return obs;
    };
    public deleteRows = (source: any[]
        , deleted: any[]
        , keycolumn: string): Observable<any[]> => {
        var commonFunctions = new CommonFunctions();
        source.forEach(sourceelement => {

            deleted.forEach(deletedelement => {
                if (sourceelement[keycolumn] == deletedelement[keycolumn]) {
                    source.splice(sourceelement);
                    deleted.splice(deletedelement);
                }
            });

        });
        deleted.forEach(deletedelement => {
            deletedelement.FLAG = 'D';
            source.push(deletedelement);
        });
        return Observable.of(source);
    };

    public exportToCSV = (filename:string,data: LocalDataSource, settings:{}) => {
     
        this.getDataFromSource(data).then((result: any[]) => {
            
            const options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                headers: Object.keys(result[result.length -1]),
            };
            new Angular5Csv(result, filename,options);
        });
    }



}