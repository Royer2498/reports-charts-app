import { Component, ViewChild } from '@angular/core';
import {ResultsService} from './services/results.service';
import {PoliticalPartiesMapperService} from './services/political-parties-mapper.service';
import {DashboardHandlerService} from './services/dashboard-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('sidenav') sidenav;

  title = 'charts-reports-app';

  constructor(
    private dashboardHandlerService: DashboardHandlerService
  ) {
  }

  public toggleSidenav($event) {
    this.sidenav.toggle();
  }

  public clickGeneralResults($event) {
    this.dashboardHandlerService.selectGeneralDashboard();
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  public clickConcejalesCount($event) {
    this.dashboardHandlerService.selectConcejalesDashboard();
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
}
