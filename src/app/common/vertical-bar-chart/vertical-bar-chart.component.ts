import { Component, OnInit, Input } from '@angular/core';
import { PoliticColors } from '../../enums/politic-colors.enum';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss']
})
export class VerticalBarChartComponent implements OnInit {

  @Input() public xAxisLabel: string = '';
  @Input() public yAxisLabel: string = '';
  @Input() public data;
  @Input() public width: number;
  @Input() public height: number;

  public colorScheme = {
    domain: [
      PoliticColors.sumate,
      PoliticColors.fpv,
      PoliticColors.pdc,
      PoliticColors.somos,
      PoliticColors.mas,
      PoliticColors.ca,
      PoliticColors.mts,
      PoliticColors.pan,
      PoliticColors.ucs,
      PoliticColors.sumate
    ]
  };

  constructor() { }

  ngOnInit(): void {}
}
