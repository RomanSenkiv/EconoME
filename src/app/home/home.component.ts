import { Component, ElementRef, ViewChild, } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { CsvParserService } from '../../services/CSVParserService';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, NgIf, StatisticsComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isDraggingOver: boolean = false;
  
  // Додаємо ViewChild для компонента app-statistics
  @ViewChild('statistics', { static: false }) statisticsSection!: ElementRef;

  constructor(private csvParserService: CsvParserService) { }

  // Подія, коли файл перетягують в область
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  // Подія, коли файл виходить з області перетягування
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  // Подія, коли файл скидають в область
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver = false;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      console.log('Dropped file: ', file);
      this.handleFileUpload(file);
    } else {
      console.error('No files dropped');
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('File selected: ', file);
      this.handleFileUpload(file);
    }
  }

  handleFileUpload(file: File): void {
    console.log('File uploaded: ', file.name);
    this.csvParserService.parseCsvFile(file);

    // Після обробки файла викликаємо прокрутку до секції <app-statistics>
    setTimeout(() => {
      this.scrollToStatistics();
    }, 100); // Невелика затримка, щоб переконатися, що елемент готовий для прокрутки
  }

  // Метод для прокрутки до <app-statistics>
  scrollToStatistics(): void {
    const element = document.querySelector('app-statistics');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('app-statistics not found in DOM!');
    }
  }
}