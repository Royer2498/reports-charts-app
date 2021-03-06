import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { PoliticColors } from '../../enums/politic-colors.enum';
import {PoliticalPartiesMapperService} from '../../services/political-parties-mapper.service';

@Component({
  selector: 'app-apex-pie',
  templateUrl: './apex-pie.component.html',
  styleUrls: ['./apex-pie.component.scss']
})
export class ApexPieComponent implements OnInit {

  @Input() public height: number;
  @Input() public data;

  public chartOptions: any;
  public partidos;

  constructor(
    private cdRef:ChangeDetectorRef,
    private politicalPartiesMapperService: PoliticalPartiesMapperService) {}

  ngOnInit(): void {
    this.partidos = this.politicalPartiesMapperService.getPoliticalPartiesList();
    if (!this.data) {
      this.data = []
    } else {
      this.data = Array.from(this.data.values());
    }

    this.chartOptions = {
      series: this.data,
      chart: {
        width: "100%",
        height: `${this.height}px`,
        type: "pie"
      },
      colors: [
        PoliticColors.sumate,
        PoliticColors.fpv,
        PoliticColors.pdc,
        PoliticColors.somos,
        PoliticColors.mas,
        PoliticColors.ca,
        PoliticColors.mts,
        PoliticColors.pan,
        PoliticColors.ucs,
      ],
      labels: this.partidos,
      legend: {
        show: true,
        position: "right",
        fontSize: '12px',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 5,
        height: "100%",
        markers: {
          width: 12,
          height: 12,
          radius: 3,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          horizontal: 5,
          vertical: 3
        }
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              width: "100%"
            },
            legend: {
              position: "bottom"
            },
            horizontalAlign: 'center'
          }
        }
      ]
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.height && !changes.height.firstChange) {
      this.chartOptions.chart.height = `${changes.height.currentValue}px`
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      this.cdRef.detectChanges();
    }
    if (changes.data && !changes.data.firstChange) {
      this.chartOptions.series = Array.from(changes.data.currentValue.values());
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      this.cdRef.detectChanges();
    }
  }
}
