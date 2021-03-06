import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { ResultsService } from '../../services/results.service';
import { ChartType } from '../../enums/chart-type.enum';
import { TableSwitchType } from '../../enums/table-switch-type.enum';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DashboardHandlerService} from '../../services/dashboard-handler.service';
import {ConcejalesCounterService} from '../../services/concejales-counter.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-results-dashboard',
  templateUrl: './results-dashboard.component.html',
  styleUrls: ['./results-dashboard.component.scss']
})
export class ResultsDashboardComponent implements OnInit, OnDestroy {
  
  Arr = Array;
  private unsubscribe: Subject<void> = new Subject();
  private subscription: Subscription;
  private timeInterval = interval(10000);

  public statusMap: Map<string, string> = new Map();
  public barValue = ChartType.BAR;
  public pieValue = ChartType.PIE;
  public percentageValue = TableSwitchType.PERCENTAGE;
  public totalValue = TableSwitchType.TOTAL;
  
  public isSmallDevice = false;
  public innerWidth: any;

  /// xxxxxxxxxxxx Informacion resultados
  
  // Informacion tal cual la API
  public alcaldeResults;  
  public concejalesResults;
  
  // Informacion filtrada
  public alcaldeResultsCount;
  public concejalesResultsCount;

  public alcaldeResultsPercentage;
  public concejalesResultsPercentage;

  public alcaldeSpecialCount;
  public alcaldeSpecialPercentage;

  public concejalesSpecialCount;
  public concejalesSpecialPercentage;

  // Informacion para la tabla (Tiene que ser en forma de lista de objetos)
  public tableCountData;
  public tablePercentageData;

  // Porcentaje de actas computadas
  public alcaldeProgress;
  public concejalesProgress;

  // Numero de concejales asignados a cada partido
  public concejalesCounter;

  public isGeneralReport = true;
  public isLoading = false;

  constructor(
    private resultsService: ResultsService,
    private cdRef: ChangeDetectorRef,
    private dashboardHandlerService: DashboardHandlerService,
    private concejalesCounterService: ConcejalesCounterService) {
      this.statusMap.set('alcalde', ChartType.BAR);
      this.statusMap.set('gobernador', ChartType.BAR);
      this.statusMap.set('results', TableSwitchType.PERCENTAGE);
  }

  async ngOnInit() {
    this.isLoading = true;

    this.innerWidth = window.screen.width;
    if (this.innerWidth < 600) {
      this.isSmallDevice = true;
    }

    this.subscription = this.timeInterval.subscribe(async val => {
      console.log("Haciendo request de nuevo")
      // await this.resultsService.getConcejalesResults();
      // await this.resultsService.getAlcaldeResults();
    });

    this.dashboardHandlerService.isGeneralDashboard$.pipe(takeUntil(this.unsubscribe)).subscribe(option => {
      if (typeof option === 'boolean') {
        this.isGeneralReport = option;
        if (!this.isGeneralReport && this.concejalesResultsCount && this.concejalesResultsPercentage) {
          this.concejalesCounter = this.concejalesCounterService.formatResponse(
            this.concejalesCounterService.calculateNumber(this.concejalesResultsCount, this.concejalesResultsPercentage)
          );
        }
      }
    });

    this.resultsService.alcaldeResults$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (data) {
        this.alcaldeResults = data;
        this.alcaldeResultsCount = this.resultsService.getAlcaldeVotes(data);
        this.alcaldeResultsPercentage = this.resultsService.getAlcaldePercentages(data);
        this.alcaldeSpecialCount = this.resultsService.getAlcaldeSpecialVotesCount(data);
        this.alcaldeSpecialPercentage = this.resultsService.getAlcaldeSpecialVotesPercentages(data);
        this.alcaldeProgress = Math.floor(this.resultsService.getPercentageProgress(this.alcaldeResults));
      }
    });

    this.resultsService.concejalesResults$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (data) {
        this.concejalesResults = data;
        this.concejalesResultsCount = this.resultsService.getConcejalesVotes(this.concejalesResults);
        this.concejalesResultsPercentage = this.resultsService.getConcejalPercentages(this.concejalesResults);
        this.concejalesSpecialCount = this.resultsService.getConcejalesSpecialVotesCount(this.concejalesResults);
        this.concejalesSpecialPercentage = this.resultsService.getConcejalesSpecialVotesPercentage(this.concejalesResults);
        this.concejalesProgress = Math.floor(this.resultsService.getPercentageProgress(this.concejalesResults));
      }
    });

    await this.resultsService.getConcejalesResults();
    await this.resultsService.getAlcaldeResults();
    this.isLoading = false;
    this.tableCountData = this.resultsService.getResultsForTable(this.alcaldeResultsCount, this.concejalesResultsCount);
    this.tablePercentageData = this.resultsService.getResultsForTable(this.alcaldeResultsPercentage, this.concejalesResultsPercentage);
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(event) {
    this.innerWidth = window.screen.width;
    if (window.screen.width < 600) {
      this.isSmallDevice = true;
      this.cdRef.detectChanges();
    } else {
      this.isSmallDevice = false;
      this.cdRef.detectChanges();
    }
  }

  public changeChart($event) {
    const type = $event.source.name;
    const chartChanged = $event.value;
    this.statusMap.set(type, chartChanged);
    this.cdRef.detectChanges();
  }

  onResize($event) {
    setTimeout(() => {
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
