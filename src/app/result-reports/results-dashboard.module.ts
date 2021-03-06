import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsDashboardComponent } from './results-dashboard/results-dashboard.component';
import { CommonComponentsModule } from '../common/common-components.module';
import {RouterModule, Routes} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: ResultsDashboardComponent,
    children: []
  }
];

@NgModule({
  declarations: [
    ResultsDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonComponentsModule,
    NgxChartsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ResultsDashboardModule { }
