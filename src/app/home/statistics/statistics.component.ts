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

  ngOnInit(): void {
    
  }
}

