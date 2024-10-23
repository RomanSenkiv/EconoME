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
}
