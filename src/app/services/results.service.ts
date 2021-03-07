import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConcejalResult, AlcaldeResult} from '../interfaces/result.interface';
import {PoliticalPartiesMapperService} from './political-parties-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private concejalesUrl: string = 'https://francisquita.org/api/mesa_alcalde/total_concejal/';
  private alcaldeUrl: string = 'https://francisquita.org/api/mesa_alcalde/total_alcalde/';
  private totalActs = 2460; 

  public alcaldeResults$ = new BehaviorSubject<any>(null);
  private alcaldeResults: any;
  public concejalesResults$ = new BehaviorSubject<any>(null);
  private concejalesResults: any;

  constructor(
    private http:HttpClient,
    private politicalPartiesMapperService: PoliticalPartiesMapperService) {}

  public async getConcejalesResults() {
    const data = await this.http.request('GET', this.concejalesUrl).toPromise();
    this.concejalesResults = data;
    this.concejalesResults$.next(data);
  }

  public async getAlcaldeResults() {
    const data = await this.http.request('GET', this.alcaldeUrl).toPromise();
    this.alcaldeResults = data;
    this.alcaldeResults$.next(data);
  }

  public updateAlcaldeData() {
    this.alcaldeResults$.next(this.alcaldeResults);
  }

  public updateConcejalesData() {
    this.concejalesResults$.next(this.concejalesResults);
  }

  // Alcaldes

  public getAlcaldeVotes(result: AlcaldeResult) {
    const partiesMap = this.politicalPartiesMapperService.getAlcaldeMap();
    const voteCounts = result.votosAlcalde[0];
    return this.getPartiesValues(voteCounts, partiesMap);
  }

  public getAlcaldePercentages(result: AlcaldeResult) {
    const partiesMap = this.politicalPartiesMapperService.getAlcaldeMap();
    const votePercentages = result.porcentaje;
    return this.getPartiesValues(votePercentages, partiesMap);
  }

  public getAlcaldeSpecialVotesCount(result: AlcaldeResult) {
    const partiesMap = this.politicalPartiesMapperService.getAlcaldeMap();
    const voteCounts = result.votosAlcalde[0];
    return this.getPartiesSpecialValues(voteCounts, partiesMap, 'Alcalde');
  }

  public getAlcaldeSpecialVotesPercentages(result: any) {
    const partiesMap = this.politicalPartiesMapperService.getAlcaldeMap();
    const votePercentages = result.porcentaje;
    return this.getPartiesSpecialPercentages(votePercentages, partiesMap);
  }

  // Concejales

  public getConcejalesVotes(result: ConcejalResult) {
    const partiesMap = this.politicalPartiesMapperService.getConcejalMap();
    const voteCounts = result.votosConcejal[0];
    return this.getPartiesValues(voteCounts, partiesMap);
  }

  public getConcejalPercentages(result: AlcaldeResult) {
    const partiesMap = this.politicalPartiesMapperService.getConcejalMap();
    const votePercentages = result.porcentaje;
    return this.getPartiesValues(votePercentages, partiesMap);
  }

  public getConcejalesSpecialVotesCount(result: ConcejalResult) {
    const partiesMap = this.politicalPartiesMapperService.getConcejalMap();
    const voteCounts = result.votosConcejal[0];
    return this.getPartiesSpecialValues(voteCounts, partiesMap, 'Concejales');
  }

  public getConcejalesSpecialVotesPercentage(result: ConcejalResult) {
    const partiesMap = this.politicalPartiesMapperService.getConcejalMap();
    const percentages = result.porcentaje;
    return this.getPartiesSpecialPercentages(percentages, partiesMap);
  }

  // Funciones generales

  public getPartiesValues(results, labelsMap) {
    const resultMap = new Map(labelsMap);
    Object.keys(results).forEach((key) => {
      if (labelsMap.get(key)) {
        resultMap.set(key, results[key]);
      }
    });
    return resultMap
  }

  public getPartiesSpecialValues(results, labelsMap, type) {
    const resultMap = new Map();
    const missingLabel = type === 'Concejales' ? 'c_validos' : 'a_validos';
    resultMap.set(missingLabel, this.calculateValidVotesCount(results, Array.from(labelsMap.keys())))
    Object.keys(results).forEach((key) => {
      if (!labelsMap.get(key) && key != '_id') {
        resultMap.set(key, results[key]);
      }
    });
    return resultMap;
  }

  public getPartiesSpecialPercentages(results, labelsMap) {
    const resultMap = new Map();
    Object.keys(results).forEach((key) => {
      if (!labelsMap.get(key) && key != '_id') {
        resultMap.set(key, results[key]);
      }
    });
    return resultMap;
  }

  private calculateValidVotesCount(partiesVotes: any, codes) {
    let result = 0;
    codes.forEach(code => {
      result = result + Number(partiesVotes[code]);
    });
    return result;
  }

  public getTablesCount(result: any) {
    return result.cantidadMesas;
  }

  public getPercentageProgress(result: any) {
    const tablesCount = this.getTablesCount(result);
    //console.log((tablesCount / this.totalActs) * 100)
    //return (tablesCount / this.totalActs) * 100;
    let resultAux = (tablesCount / this.totalActs) * 100;
    return resultAux;
  }

  public getResultsForTable(alcaldeResultMap: any, concejalesResultMap, isAlcaldeVotesEmpty, isConcejalesVotesEmpty) {
    const partiesLabels = this.politicalPartiesMapperService.getPoliticalPartiesList();
    const alcaldeResult = !isAlcaldeVotesEmpty ?
      Array.from(alcaldeResultMap, ([partido, value]) => ({ partido, value })) :
      Array(9).fill(1);
    const concejalResult = !isConcejalesVotesEmpty ?
      Array.from(concejalesResultMap, ([partido, value]) => ({ partido, value })) :
      Array(9).fill(1);

    return alcaldeResult.map((result, index) => {
      return {
        initials: this.capitalizeFirstLetter(partiesLabels[index]),
        alcalde: !isAlcaldeVotesEmpty ? result.value : 0,
        concejales: !isConcejalesVotesEmpty ? concejalResult[index].value : 0
      }
    });
  }

  public getEmptyAlcaldeResults() {
    let clonedMap = new Map(this.politicalPartiesMapperService.getAlcaldeMap());
    clonedMap.forEach((value, key) => {
      clonedMap.set(key, 0);
    });
    return clonedMap;
  }

  public getEmptyConcejalesResults() {
    let clonedMap = new Map(this.politicalPartiesMapperService.getConcejalMap());
    clonedMap.forEach((value, key) => {
      clonedMap.set(key, 0);
    });
    return clonedMap;
  }

  public getEmptySpecialAlcaldeResults() {
    let clonedMap = new Map();
    clonedMap.set('a_validos', 0);
    clonedMap.set('a_nulos', 0);
    clonedMap.set('a_blancos', 0);
    return clonedMap;
  }

  public getEmptySpecialConcejalesResults() {
    let clonedMap = new Map();
    clonedMap.set('c_validos', 0);
    clonedMap.set('c_nulos', 0);
    clonedMap.set('c_blancos', 0);
    return clonedMap;
  }

  public capitalizeFirstLetter(word: any) {
    return `${word.charAt(0)}${word.slice(1).toLowerCase()}`
  }
}