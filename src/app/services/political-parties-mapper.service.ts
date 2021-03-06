import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PoliticalPartiesMapperService {

  public alcaldeMap: Map<string, number | string> = new Map();
  public concejalMap: Map<string, number | string> = new Map();
  public concejalMapColors: any;

  constructor() {
    this.alcaldeMap.set("a_sumate", "SUMATE");
    this.alcaldeMap.set("a_fpv", "FPV");
    this.alcaldeMap.set("a_pdc", "PDC");
    this.alcaldeMap.set("a_somos", "SOMOS");
    this.alcaldeMap.set("a_mas_ipsp", "MAS");
    this.alcaldeMap.set("a_ca", "CA");
    this.alcaldeMap.set("a_mts", "MTS");
    this.alcaldeMap.set("a_pan_bol", "PANBOL");
    this.alcaldeMap.set("a_ucs", "UCS");

    this.concejalMap.set("c_sumate", "SUMATE");
    this.concejalMap.set("c_fpv", "FPV");
    this.concejalMap.set("c_pdc", "PDC");
    this.concejalMap.set("c_somos", "SOMOS");
    this.concejalMap.set("c_mas_ipsp", "MAS");
    this.concejalMap.set("c_ca", "CA");
    this.concejalMap.set("c_mts", "MTS");
    this.concejalMap.set("c_pan_bol", "PANBOL");
    this.concejalMap.set("c_ucs", "UCS");
  }

  public getPoliticalPartiesList() {
    return Array.from(this.alcaldeMap.values());
  }

  public getAlcaldeCodes() {
    return Array.from(this.alcaldeMap.keys());
  }

  public getConcejalesCodes() {
    return Array.from(this.concejalMap.keys());
  }

  public getAlcaldeMap() {
    return this.alcaldeMap;
  }

  public getConcejalMap() {
    return this.concejalMap;
  }
}
