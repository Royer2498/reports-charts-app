import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ChartType } from '../../enums/chart-type.enum';
import { TableSwitchType } from '../../enums/table-switch-type.enum';


@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss']
})
export class SwitcherComponent implements OnInit {

  @Input() public name: string;
  @Input() public isTableSwitcher: string;

  @Output() public change: EventEmitter<any> = new EventEmitter();

  public barValue = ChartType.BAR;
  public pieValue = ChartType.PIE;

  public percentageValue = TableSwitchType.PERCENTAGE;
  public totalValue = TableSwitchType.TOTAL;

  constructor() { }

  ngOnInit(): void {
  }

  public changeOption($event) {
    this.change.emit($event);
  }

}
