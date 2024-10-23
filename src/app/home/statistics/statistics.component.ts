import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CsvParserService } from '../../../services/CSVParserService';
import { ChartBuilderService } from '../../../services/ChartBuilderService';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private csvParserService: CsvParserService,
    private chartBuilderService: ChartBuilderService
  ) {}

  ngOnInit(): void {
    this.csvParserService.getParsedData().subscribe((parsedData) => {
      if (parsedData.length > 0) {
        const { income, expenses } = this.csvParserService.calculateIncomeAndExpensesForCurrentMonth(parsedData);
        this.createChart(income, expenses);
      }
    });
  }

  createChart(income: number, expenses: number): void {
    this.chartBuilderService.createIncomeExpenseChart(this.myChart.nativeElement, income, expenses);
  }
  
}

