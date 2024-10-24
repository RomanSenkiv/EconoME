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
          labels: ['Income', 'Expenses'],
          datasets: [{
            label: 'UAH',
            data: [income, expenses],
            backgroundColor: [
              'rgba(28, 156, 54, 1)', // Green for income
              'rgba(201, 22, 55, 1)'  // Red for expenses
            ],
            borderColor: [
              'rgba(1, 1, 1, 0.8)',   // Green border for income
              'rgba(1, 1, 1, 0.8)'    // Red border for expenses
            ],
            borderWidth: 0
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white' // Y-axis font color
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light white grid lines with transparency
                lineWidth: 1
              }
            },
            x: {
              ticks: {
                color: 'white' // X-axis font color
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Light white grid lines with transparency
                lineWidth: 1
              }
            }
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 20,
              bottom: 10
            }
          },
          plugins: {
            legend: {
              display: false // Disable the legend
            },
            title: {
              display: true,
              text: 'Currency: UAH',
              color: 'white' // Title font color
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
            label: 'Expenses by category (UAH)',
            data: data, // Суми витрат по категоріях
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)', // Різні кольори для кожної категорії
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(201, 203, 207, 0.8)'
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
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 20,
              bottom: 10
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
              // text: 'Розподіл витрат по категоріях',
              color: 'white' // Колір заголовку
            }
          }
        }
      });
    }
  }
}