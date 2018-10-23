import { Component, OnInit, Input } from '@angular/core';
import { SmartTable } from '../../service/smarttable.servics';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'export-table',
  templateUrl: './export-table.component.html',
  styleUrls: ['./export-table.component.scss']
})
export class ExportTableComponent implements OnInit {
  @Input() source: LocalDataSource;
  @Input() filename: string;
  @Input() settings: {};

  constructor(private SmartTableService: SmartTable, ) {
    if (this.filename == "undefinedd" || this.filename == "" || this.filename == null) {
      this.filename = "file";
    }
  }

  ngOnInit() {
  }
  exportCSV(): void {

    this.SmartTableService.exportToCSV(this.filename, this.source, this.settings);
  }
}
