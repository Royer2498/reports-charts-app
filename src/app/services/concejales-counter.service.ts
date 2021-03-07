import { Injectable } from '@angular/core';
import { PoliticalPartiesMapperService } from './political-parties-mapper.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConcejalesCounterService {
  // Numero de escanios es 11
  private escanios = 11;
  public mapPrueba = new Map();
  public mapPercetanges  = new Map();

  constructor(
    private politicalPartiesMapperService: PoliticalPartiesMapperService
  ) {
    this.mapPrueba.set("c_sumate", 7000);
    this.mapPrueba.set("c_fpv", 5000);
    this.mapPrueba.set("c_pdc", 3000);
    this.mapPrueba.set("c_somos", 2000);
    this.mapPrueba.set("c_mas_ipsp", 1000);

    this.mapPrueba.set("nodeberiam", 20);
    this.mapPrueba.set("nodeberiam2", 34);
    this.mapPrueba.set("nodeberiam3", 13);
    this.mapPrueba.set("nodeberiam4", 0);

    this.mapPercetanges.set("c_sumate", 45);
    this.mapPercetanges.set("c_fpv", 50);
    this.mapPercetanges.set("c_pdc", 50);
    this.mapPercetanges.set("c_somos", 50);
    this.mapPercetanges.set("c_mas_ipsp", 50);
    this.mapPercetanges.set("nodeberiam", 2);
    this.mapPercetanges.set("nodeberiam2", 1);
    this.mapPercetanges.set("nodeberiam3", 1);
    this.mapPercetanges.set("nodeberiam4", 0);
  }

  public calculateNumber(resultsCounts, resultsPercentage) {
    let matrix = this.generateMatrix(resultsCounts, resultsPercentage);

    // Pruebas solo
    // let matrix = this.generateMatrix(this.mapPrueba, this.mapPercetanges);
    matrix = matrix.flat().sort(this.compare);

    let firstEleven = matrix.slice(0, this.escanios);
    let mapResponse = this.generateMapResult(firstEleven);
    this.addLosers(mapResponse);
    return mapResponse;
  }

  public generateMatrix(resultsCounts, resultsPercentage) {
    let result = [];

    resultsCounts.forEach((value, key) => {
      if (resultsPercentage.get(key) && resultsPercentage.get(key) > 3) {
        result.push(this.generateRow(key, value));
      }
    });

    return result;
  }

  public generateMapResult(firstEleven) {
    let mapResult = new Map();
    firstEleven.forEach((element) => {
      if (mapResult.get(element.partido)) {
        mapResult.set(element.partido, mapResult.get(element.partido) + 1)
      } else {
        mapResult.set(element.partido, 1)
      }
    })
    return mapResult;
  }

  prueba(a) {
    return a.sort(this.compare);
  }

  public compare(a, b) {
    if ( a.value > b.value ){
      return -1;
    }
    if ( a.value < b.value ){
      return 1;
    }
    return 0;
  }

  public generateRow(partido, totalVotes) {
    let result = [];
    for (let index = 1 ; index <= this.escanios; index++) {
      result.push({
        partido,
        value: Math.floor(totalVotes/index)
      })
    }
    return result;
  }

  public formatResponse(resultMap) {
    let concejalesCodes = this.politicalPartiesMapperService.getConcejalMap();
    let result = [];
    resultMap.forEach((value, key) => {
      result.push({
        partido: this.formateName(concejalesCodes.get(key)),
        value: value
      })
    });
    return result;
  }

  public addLosers(resultMap) {
    let concejalesCodes = this.politicalPartiesMapperService.getConcejalMap();
    concejalesCodes.forEach((value, key) => {
      if (!resultMap.get(key)) {
        resultMap.set(key, 0)
      }
    });
  }

  public formateName(word) {
    return `${word.charAt(0)}${word.slice(1).toLowerCase()}`
  }
}