import { Injectable } from '@angular/core';
import { error } from 'console';
import { Papa } from 'ngx-papaparse'; // Підключаємо папапарсер
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  
  private parsedDataSubject = new BehaviorSubject<any[]>([]);
  parsedData$ = this.parsedDataSubject.asObservable(); // Потік для передачі парсованих даних

  constructor(private papa: Papa) {}

  // Метод для парсингу CSV
  parseCsvFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const csvData = event.target.result;
      this.papa.parse(csvData, {
        header: true, // Автоматично обробляє заголовки
        skipEmptyLines: true,
        complete: (result) => {
          this.parsedDataSubject.next(result.data); // Передаємо парсовані дані в стрім
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        }
      });
    };

    reader.readAsText(file);
  }

  // Об'єкт для визначення категорій за MCC кодами
  private mccCategoryMap: { [key: string]: string } = {
    '5411': 'Продукти',
    '5812': 'Ресторани', 
    '4111': 'Транспорт', 
    '5732': 'Електроніка', 
    '5912': 'Аптеки',
    '4829': 'Переказ на карту',
    '5651': 'Одяг і взуття',
    '5943': 'Канцелярські товари',
  };

  // Метод для фільтрації даних за поточний місяць і підрахунку доходів та витрат
  calculateIncomeAndExpensesForCurrentMonth(data: any[]): { income: number, expenses: number } {
    let income = 0;
    let expenses = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Поточний місяць (0-11)
    const currentYear = currentDate.getFullYear(); // Поточний рік

    // Обробка даних
    data.forEach(item => {
      // Парсимо дату правильно, враховуючи формат "дд.мм.рррр гг:хх:сс"
      const dateParts = item["Date and time"].split(' ')[0].split('.');
      const transactionDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);

      const amount = parseFloat(item["Card currency amount, (UAH)"] || 0);
      const description = item.Description.toLowerCase();

      // Фільтруємо лише транзакції за поточний місяць і рік
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
        // Якщо сума позитивна - це дохід, якщо негативна - витрата
        if (amount > 0) {
          income += amount; // Додаємо дохід
        } else {
          expenses += Math.abs(amount); // Додаємо витрату (беремо абсолютне значення)
        }
      }
    });

    return { income, expenses };
  }

  // Метод для категоризації витрат за MCC кодами
  calculateExpensesByCategoryForCurrentMonth(data: any[]): { category: string, amount: number }[] {
    const categoryMap: { [key: string]: number } = {};
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Поточний місяць (0-11)
    const currentYear = currentDate.getFullYear(); // Поточний рік

    data.forEach(item => {
      // Парсимо дату транзакції
      const dateParts = item["Date and time"].split(' ')[0].split('.');
      const transactionDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);

      const amount = parseFloat(item["Card currency amount, (UAH)"] || 0);
      const mccCode = item.MCC;

      // Фільтруємо за поточний місяць і рік, та обробляємо лише витрати
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear && amount < 0) {
        const category = this.mccCategoryMap[mccCode] || 'Інші витрати'; // Зіставляємо MCC код з категорією

        // Додаємо суми до категорій
        if (categoryMap[category]) {
          categoryMap[category] += Math.abs(amount);
        } else {
          categoryMap[category] = Math.abs(amount);
        }
      }
    });

    // Перетворюємо map у масив для графіка
    return Object.keys(categoryMap).map(category => ({
      category: category,
      amount: categoryMap[category]
    }));
  }

  getParsedData(): Observable<any[]> {
    return this.parsedData$;
  }
}
