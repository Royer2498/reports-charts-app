import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardHandlerService {

  public isGeneralDashboard$ = new BehaviorSubject<boolean>(null);
  private isGeneralDashboard: boolean;

  constructor() {
    this.isGeneralDashboard = true;
  }

  public selectGeneralDashboard() {
    this.isGeneralDashboard = true;
    this.isGeneralDashboard$.next(this.isGeneralDashboard);
  }

  public selectConcejalesDashboard() {
    this.isGeneralDashboard = false;
    this.isGeneralDashboard$.next(this.isGeneralDashboard);
  }

  public refreshDashboard() {
    this.isGeneralDashboard$.next(this.isGeneralDashboard);
  }
}
