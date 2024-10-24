import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('expensesChart') expensesChart!: ElementRef<HTMLCanvasElement>;

  transactions: any[] = []; // Змінна для збереження транзакцій
  isFileUploaded = false;

  constructor(
    private csvParserService: CsvParserService,
    private chartBuilderService: ChartBuilderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.csvParserService.getParsedData().subscribe((parsedData) => {
      if (parsedData.length > 0) {
        this.isFileUploaded = true;
        this.cdr.detectChanges();
        
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

  ngAfterViewInit(): void {
    // // Використовується лише при першому завантаженні файлу
    // if (this.isFileUploaded) {
    //   this.createIncomeExpenseChart(0, 0);
    //   this.createExpensesCategoryChart([]);
    // }
  }

  createIncomeExpenseChart(income: number, expenses: number): void {
    this.chartBuilderService.createIncomeExpenseChart(this.myChart.nativeElement, income, expenses);
  }

  createExpensesCategoryChart(expensesByCategory: { category: string; amount: number }[]): void {
    this.chartBuilderService.createExpenseCategoryPieChart(this.expensesChart.nativeElement, expensesByCategory);
  }
}

