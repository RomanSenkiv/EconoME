import { Injectable } from '@angular/core';
import { error } from 'console';
import { Papa } from 'ngx-papaparse'; // Підключаємо папапарсер
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  private parsedDataSubject = new BehaviorSubject<any[]>([]);
  parsedData$ = this.parsedDataSubject.asObservable();

  constructor (private papa: Papa) {}

  parsedFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const csvData = event.target.result;
      this.papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const cleanData = this.cleanCsvData(result.data);
          this.parsedDataSubject.next(cleanData);
          console.log(cleanData);
        },
        error: (error) => {
          console.error('Error parsing CSV file', error);
        }
      });
    };

    reader.readAsText(file);
  }

  cleanCsvData (data: any[]): any[] {
    return data.map( item => ({
      date: item['Date and time'],
      description: item['Description'],
      MCC: item['MCC'],
      amount: parseFloat(item['Operation amount'] || 0),
      currency: item['Operation currency'],
      balance: parseFloat(item['Balance'] || 0)
    }));
  }

  getParsedData(): Observable<any[]> {
    return this.parsedData$;
  }
}
