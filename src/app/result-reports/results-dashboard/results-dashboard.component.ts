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
  //private timeInterval = interval(120000); // 2 minutos
  private timeInterval = interval(120000); // 2 minutos

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
  public isEmpty = false;

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
      this.isLoading = true;
      await this.resultsService.getConcejalesResults();
      await this.resultsService.getAlcaldeResults();
      let isAlcaldeVotesEmpty = this.isAlcaldeDataEmpty(this.alcaldeResults);
      let isConcejalesVotesEmpty = this.isConcejalesDataEmpty(this.concejalesResults);
      this.tableCountData = this.resultsService.getResultsForTable(
        this.alcaldeResultsCount, this.concejalesResultsCount, isAlcaldeVotesEmpty, isConcejalesVotesEmpty);
      this.tablePercentageData = this.resultsService.getResultsForTable(
        this.alcaldeResultsPercentage, this.concejalesResultsPercentage, isAlcaldeVotesEmpty, isConcejalesVotesEmpty);
      this.isLoading = false;
      if (!this.isGeneralReport && this.concejalesResultsCount && this.concejalesResultsPercentage) {
       this.dashboardHandlerService.refreshDashboard();
      }
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
        if (!this.isAlcaldeDataEmpty(this.alcaldeResults)) {
          this.alcaldeResultsCount = this.resultsService.getAlcaldeVotes(data);
          this.alcaldeResultsPercentage = this.resultsService.getAlcaldePercentages(data);
          this.alcaldeSpecialCount = this.resultsService.getAlcaldeSpecialVotesCount(data);
          this.alcaldeSpecialPercentage = this.resultsService.getAlcaldeSpecialVotesPercentages(data);
          this.alcaldeProgress = this.resultsService.getPercentageProgress(this.alcaldeResults);
          this.alcaldeProgress = this.alcaldeProgress.toFixed(2);
        } else {
          this.setAllAlcaldeAsEmpty();
        }
      }
    });

    this.resultsService.concejalesResults$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (data) {
        this.concejalesResults = data;
        if (!this.isConcejalesDataEmpty(this.concejalesResults)) {
          this.concejalesResultsCount = this.resultsService.getConcejalesVotes(this.concejalesResults);
          this.concejalesResultsPercentage = this.resultsService.getConcejalPercentages(this.concejalesResults);
          this.concejalesSpecialCount = this.resultsService.getConcejalesSpecialVotesCount(this.concejalesResults);
          this.concejalesSpecialPercentage = this.resultsService.getConcejalesSpecialVotesPercentage(this.concejalesResults);
          this.concejalesProgress = this.resultsService.getPercentageProgress(this.concejalesResults);
          this.concejalesProgress = this.concejalesProgress.toFixed(2);
        } else {
          this.setAllConcejalesAsEmpty();
        }
      }
    });

    await this.resultsService.getConcejalesResults();
    await this.resultsService.getAlcaldeResults();
    this.isLoading = false;
    let isAlcaldeVotesEmpty = this.isAlcaldeDataEmpty(this.alcaldeResults);
    let isConcejalesVotesEmpty = this.isConcejalesDataEmpty(this.concejalesResults);
    this.tableCountData = this.resultsService.getResultsForTable(
      this.alcaldeResultsCount, this.concejalesResultsCount, isAlcaldeVotesEmpty, isConcejalesVotesEmpty);
    this.tablePercentageData = this.resultsService.getResultsForTable(
      this.alcaldeResultsPercentage, this.concejalesResultsPercentage, isAlcaldeVotesEmpty, isConcejalesVotesEmpty);
  }

  public isAlcaldeDataEmpty(results) {
    const percents = results.porcentaje;
    const alcaldeVotes = results.votosAlcalde;
    return this.isObjectEmpty(percents) || alcaldeVotes.length === 0 || results.cantidadMesas === 0; 
  }

  public isConcejalesDataEmpty(results) {
    const percents = results.porcentaje;
    const concejalesVotes = results.votosConcejal;
    return this.isObjectEmpty(percents) || concejalesVotes.length === 0 || results.cantidadMesas === 0; 
  }

  public setAllAlcaldeAsEmpty() {
    this.isEmpty = true;
    this.alcaldeResultsCount = this.resultsService.getEmptyAlcaldeResults();
    this.alcaldeResultsPercentage = this.resultsService.getEmptyAlcaldeResults();
    this.alcaldeSpecialCount = this.resultsService.getEmptySpecialAlcaldeResults();
    this.alcaldeSpecialPercentage = this.resultsService.getEmptySpecialAlcaldeResults();
    this.alcaldeProgress = 0;
  }

  public setAllConcejalesAsEmpty() {
    this.isEmpty = true;
    this.concejalesResultsCount = this.resultsService.getEmptyConcejalesResults();
    this.concejalesResultsPercentage = this.resultsService.getEmptyConcejalesResults();
    this.concejalesSpecialCount = this.resultsService.getEmptySpecialConcejalesResults();
    this.concejalesSpecialPercentage = this.resultsService.getEmptySpecialConcejalesResults();
    this.concejalesProgress = 0;
  }

  public isObjectEmpty(object) {
    return Object.keys(object).length === 0;
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
