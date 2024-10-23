import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartBuilderService {

  constructor() {
    Chart.register(...registerables); // Реєструємо Chart.js
  }

  createIncomeExpenseChart(canvas: HTMLCanvasElement, income: number, expenses: number): void {
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Прибуток', 'Витрати'],
          datasets: [{
            label: 'Сума (UAH)',
            data: [income, expenses],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)', // Зелений для прибутку
              'rgba(255, 99, 132, 0.6)'  // Червоний для витрат
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',   // Зелений для прибутку
              'rgba(255, 99, 132, 1)'    // Червоний для витрат
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white' // Колір шрифту осі Y
              }
            },
            x: {
              ticks: {
                color: 'white' // Колір шрифту осі X
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white' // Колір шрифту легенди
              }
            },
            title: {
              display: true,
              text: 'Прибуток і Витрати за поточний місяць',
              color: 'white' // Колір заголовку
            }
          }
        }
      });
    }
  }

  // Новий метод для створення кругової діаграми витрат за категоріями
  createExpenseCategoryPieChart(canvas: HTMLCanvasElement, categories: { category: string, amount: number }[]): void {
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const labels = categories.map(cat => cat.category); // Назви категорій
      const data = categories.map(cat => cat.amount); // Суми для кожної категорії

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels, // Категорії
          datasets: [{
            label: 'Витрати по категоріях (UAH)',
            data: data, // Суми витрат по категоріях
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // Різні кольори для кожної категорії
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(201, 203, 207, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'white' // Колір шрифту легенди
              }
            },
            title: {
              display: true,
              text: 'Розподіл витрат по категоріях',
              color: 'white' // Колір заголовку
            }
          }
        }
      });
    }
  }
}
