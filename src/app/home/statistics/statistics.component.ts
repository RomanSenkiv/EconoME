import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { CsvParserService } from '../../../services/CSVParserService';
import { ChartBuilderService } from '../../../services/ChartBuilderService';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('expensesChart') expensesChart!: ElementRef<HTMLCanvasElement>;

  transactions: any[] = []; // Змінна для збереження транзакцій

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

        // Отримуємо транзакції за поточний місяць
        this.transactions = this.csvParserService.calculateTransactionsForCurrentMonth(parsedData);
        console.log('Transactions for current month:', this.transactions); // Перевіряємо, чи отримані транзакції
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

