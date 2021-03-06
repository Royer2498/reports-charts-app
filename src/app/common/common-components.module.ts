import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatSidenavModule} from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';

import {NavbarComponent} from './navbar/navbar.component';
import {CardComponent} from './card/card.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import { HorizontalBarChartComponent } from './horizontal-bar-chart/horizontal-bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableComponent } from './table/table.component';
import {MatSortModule} from '@angular/material/sort';
import { SwitcherComponent } from './switcher/switcher.component';
import { PieComponent } from './pie/pie.component';
import { ApexPieComponent } from './apex-pie/apex-pie.component';
import { ApexBarComponent } from './apex-bar/apex-bar.component';


@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    VerticalBarChartComponent,
    HorizontalBarChartComponent,
    TableComponent,
    SwitcherComponent,
    PieComponent,
    ApexPieComponent,
    ApexBarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgxChartsModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    MatSidenavModule,
    FlexLayoutModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    VerticalBarChartComponent,
    HorizontalBarChartComponent,
    TableComponent,
    SwitcherComponent,
    PieComponent,
    ApexPieComponent,
    ApexBarComponent
  ]
})
export class CommonComponentsModule { }
