import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.sass']
})
export class CsvImportComponent implements OnInit {

  public records: any[] = [];
  @ViewChild('csvReader', {static: false}) csvReader: any;

  constructor() { }

  ngOnInit() {
  }

  public uploadListener($event: any): void {
    const text = [];
    const files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const csvData = reader.result as string;
        const csvRecordsArray = csvData.split(/\r\n|\n/);
        //Validate record array has items
        const headersRow = this.getHeaderArray(csvRecordsArray);
        console.log(headersRow);

        this.records = this.getDataRecordsArrayFromCSVFile(headersRow, csvRecordsArray, headersRow.length);
      };
      reader.onerror =  () => console.error('error is occured while reading file!');
    } else {
      console.warn('Please import valid .csv file.');
      this.fileReset();
    }
    console.log(this.records);
  }
  getDataRecordsArrayFromCSVFile(headersRow: string[], csvRecordsArray: string[], length: number): any[] {
    const dataArray: any[] = [];
    csvRecordsArray.forEach(element => {
      dataArray.push(this.getObjectData(headersRow, element));
    });
    return dataArray;
  }
  getObjectData(headersRow: string[], row: string): any {
    const obj: any = {};
    const values = row.match(/(".*?"|[^",]+)(?=,)*/g);
    for (let index = 0; index < headersRow.length; index++) {
      // console.log(headersRow);
      obj[`${this.formatPropertiesNames(headersRow[index])}`] = this.formatValue(values[index]);
    }
    console.log(obj);
    return obj;
  }

  private formatValue(value: string): any {
    const val = value.replace(/['"]+/g, '').trimLeft();
    if (val.includes('$')) {

    }
    return val;
  }

  formatPropertiesNames(arg0: string): string {
    const words = arg0.trimLeft().split(' ');
    let outputName = '';
    if (words.length === 1) {
      outputName = words[0].toLowerCase();
    } else if ( words.length > 1) {
      for (let i = 0; i < words.length; i++) {
        if (i === 0) {
          outputName = words[i].toLowerCase();
        } else {
          outputName += words[i];
        }
      }
    }
    return outputName;
  }


  private isValidCSVFile(file: File) {
    return file.name.endsWith('.csv');
  }

  private getHeaderArray(csvRecordsArr: string[]): string[] {
    const headers = csvRecordsArr[0].split(',');
    const headerArray = [];
    headers.forEach(element => {
      headerArray.push(element);
    });
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
