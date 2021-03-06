import { Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {VoteCount} from '../../interfaces/vote-count.interface';
import {MatSort} from '@angular/material/sort';
import {ResultsService} from '../../services/results.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  
  @Input() public data;
  @Input() public isAlcaldeReport;
  @Input() public tableAlcaldeSpecialData;
  @Input() public tableConcejalesSpecialData;

  public dataSource: MatTableDataSource<VoteCount>;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['initials', 'alcalde', 'concejales'];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resultsService: ResultsService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      this.dataSource = new MatTableDataSource(changes.data.currentValue);
      this.changeDetector.detectChanges();
    }
  }
}
