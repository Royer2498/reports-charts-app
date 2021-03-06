import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() public toggle: EventEmitter<any> = new EventEmitter();
  @Output() public clickGeneralResults: EventEmitter<any> = new EventEmitter();
  @Output() public clickConcejalesCount: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public toggleSidenav($event) {
    this.toggle.emit($event);
  }

  public clickGeneral($event) {
    this.clickGeneralResults.emit($event);
  }

  public clickConcejales($event) {
    this.clickConcejalesCount.emit($event);
  }

}
