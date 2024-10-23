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
  @ViewChild('expensesChart') expensesChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private csvParserService: CsvParserService,
    private chartBuilderService: ChartBuilderService
  ) {}

  ngOnInit(): void {
    this.csvParserService.getParsedData().subscribe((parsedData) => {
      if (parsedData.length > 0) {
        // Графік прибутків і витрат
        const { income, expenses } = this.csvParserService.calculateIncomeAndExpensesForCurrentMonth(parsedData);
        this.createIncomeExpenseChart(income, expenses);

        // Графік витрат за категоріями
        const expensesByCategory = this.csvParserService.calculateExpensesByCategoryForCurrentMonth(parsedData);
        this.createExpensesCategoryChart(expensesByCategory);
      }
    });
  }

  createIncomeExpenseChart(income: number, expenses: number): void {
    this.chartBuilderService.createIncomeExpenseChart(this.myChart.nativeElement, income, expenses);
  }

  createExpensesCategoryChart(expensesByCategory: { category: string; amount: number }[]): void {
    this.chartBuilderService.createExpenseCategoryPieChart(this.expensesChart.nativeElement, expensesByCategory);
  }
}

