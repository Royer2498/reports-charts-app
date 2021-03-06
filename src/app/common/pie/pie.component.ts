import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PoliticColors } from '../../enums/politic-colors.enum';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit, OnChanges {

  @Input() public xAxisLabel: string = '';
  @Input() public yAxisLabel: string = '';
  @Input() public data;
  @Input() public width: number;
  @Input() public height: number;
  @Input() public legendTitle: number;
  @Input() public isLegendVisible: boolean;
  @Input() public isSmalllDevice: boolean;

  public legendPosition: string;


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

  constructor() {}

  ngOnInit() {
    this.legendPosition = this.isSmalllDevice ? 'below' : 'right'; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSmalllDevice && !changes.isSmalllDevice.firstChange) {
      this.legendPosition = changes.isSmalllDevice.currentValue ? 'below' : 'right'; 
    }
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
