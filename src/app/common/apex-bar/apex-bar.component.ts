import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { PoliticColors } from '../../enums/politic-colors.enum';
import {PoliticalPartiesMapperService} from '../../services/political-parties-mapper.service';

@Component({
  selector: 'app-apex-bar',
  templateUrl: './apex-bar.component.html',
  styleUrls: ['./apex-bar.component.scss']
})
export class ApexBarComponent implements OnInit {

  @Input() public height: number;
  @Input() public data;

  public partidos;
  public chartOptions: any;

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
      series: [
        {
          name: "My-series",
          data: this.data,
        }
      ],
      chart: {
        width:"100%",
        height: `${this.height}px`,
        type: "bar"
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
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
          dataLabels: {
            position: "bottom"
          }
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
              position: "bottom",
              itemMargin: {
                horizontal: 5,
                vertical: 5
              },
            },
            horizontalAlign: 'center'
          }
        }
      ],
      xaxis: {
        categories: this.partidos
      }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.height && !changes.height.firstChange && changes.height.currentValue != changes.height.previousValue) {
      this.chartOptions.chart.height = `${changes.height.currentValue}px`
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      this.cdRef.detectChanges();
    }
    if (changes.data && !changes.data.firstChange) {
      this.chartOptions.series[0].data = Array.from(changes.data.currentValue.values());
      this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      this.cdRef.detectChanges();
    }
  } 
}
