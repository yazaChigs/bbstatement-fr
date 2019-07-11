
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { StorageKey } from 'src/app/util/key';
// import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';
import { DataManagementService } from '../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NoDaysRequiremets } from '../../shared/config/model/admin/no-days-requirements.model';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';
import { resultMemoize } from '@ngrx/store';
import { StockAvailable } from 'src/app/shared/config/model/stock-available.model';
import { QuarantinedStockService } from '../../shared/config/service/quarantined-stock.service';
import { StockQuarantined } from '../../shared/config/model/Stock-quarantined.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  column = 2;
  fontSize;
  iconSize;
  // list: Module[];
  // company = JSON.parse(sessionStorage.getItem(StorageKey.COMPANY_DETAIL));
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      // console.log(this.list);
      if (matches) {
        this.column = 1;
        this.fontSize = 'font-size-small';
        this.iconSize = 'icon-size-small';
        return [
          { title: 'Registration', cols: 1, rows: 1, icon: 'supervisor_account', link: '/patient' },
          { title: 'Appointment Scheduling', cols: 1, rows: 1, icon: 'today', link: '/scheduling' },
          { title: 'Clinical', cols: 1, rows: 1, icon: 'hotel', link: 'patient/clinical'  },
          { title: 'Adminstration', cols: 1, rows: 1, icon: 'apps', link: '/admin'  },
          { title: 'Settings', cols: 1, rows: 1, icon: 'settings', link: ''  }
        ];
      }
      this.column = 2;
      this.fontSize = 'font-size-large';
      this.iconSize = 'icon-size-large';

      return [
        { title: 'Registration', cols: 1, rows: 1, icon: 'supervisor_account', link: '/patient'  },
        { title: 'Appointment Scheduling', cols: 1, rows: 1, icon: 'today', link: '/scheduling'  },
        { title: 'Clinical', cols: 1, rows: 1, icon: 'hotel', link: 'patient/clinical'  },
        { title: 'Adminstration', cols: 1, rows: 1, icon: 'apps', link: '/admin'  },
        { title: 'Settings', cols: 1, rows: 1, icon: 'settings', link: ''  }
      ];
    })
  );
  color = 'blue';
  bloodStockManagementAnalysisForm: FormGroup;
  noDaysRequiremets: NoDaysRequiremets;
  branchDailyMinimalCapacity: BranchDailyMinimalCapacity = new BranchDailyMinimalCapacity();
  stockAvailable: StockAvailable = new StockAvailable();
  stockQuarantine: StockQuarantined = new StockQuarantined();
  branchId: number;


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dataManService: DataManagementService,
              private fb: FormBuilder, private availableStockService: AvailableStockService,
              private qStockSevice: QuarantinedStockService) { }
  redirect(value) {
    this.router.navigate([value]);
  }


  ngOnInit(): void {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.createForm();
    this.getNoDaysRequrements();
    this.getAvailableStockForm();
    this.getQuarantinedStock();
    this.getBranchDailyMinimalCapacity();
  }

  createForm() {
    this.bloodStockManagementAnalysisForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      requirementsOplus: new FormControl(),
      requirementsOminus: new FormControl(),
      requirementsAplus: new FormControl(),
      requirementsBplus: new FormControl(),
      stockedUnitsOplus: new FormControl(),
      stockedUnitsOminus: new FormControl(),
      stockedUnitsAplus: new FormControl(),
      stockedUnitsBplus: new FormControl(),
      daysSupplyOplus: new FormControl(),
      daysSupplyOminus: new FormControl(),
      daysSupplyAplus: new FormControl(),
      daysSupplyBplus: new FormControl(),
      weeksSupplyOplus: new FormControl(),
      weeksSupplyOminus: new FormControl(),
      weeksSupplyAplus: new FormControl(),
      weeksSupplyBplus: new FormControl(),
      totalStockedUnitsAvailable: new FormControl(),
      totalStockedUnitsQuarantined: new FormControl(),
      bdrAvailableStockTotal: new FormControl(),
      daysSupplyAvailable: new FormControl(),
      weeksSupplyAvailable: new FormControl(),
    });
  }

  collectionsBgColor() {
    let value;
    if (this.stockQuarantine !== null) {
    value = (this.stockQuarantine.totalCollections - this.stockQuarantine.openingStock)
    / this.branchDailyMinimalCapacity.harareTotalMinCapacity;
    if (value !== undefined && value !== null) {
      if (value >= 1) { return 'purple'; }
      if (value >= 0.75 && value < 1) { return 'green'; }
      if (value >= 0.4 && value < 0.75) { return 'orange'; }
      if (value >= 0 && value < 0.4) { return 'green'; } else { return 'pink'; }
    }
  }
}



  demandVsSupplyBgColor() {
    let value;
    if (this.stockAvailable !== null) {
    value = this.stockAvailable.hospitals / this.stockAvailable.totalHospitalOrders;
    if (value !== undefined && value !== null) {
      if (value >= 0.5) { return 'green'; }
      if (value >= 0.25 && value < 0.5) { return 'orange'; }
      if (value >= 0 && value < 0.25) { return 'green'; } else { return 'pink'; }
    }
  }
  }

  stockLevelColorCodeOplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyOplus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'orange'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeOminus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyOminus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'amber'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeAplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyAplus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'amber'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeBplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyBplus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'amber'; }
    if (value >= 5) { return 'green'; }
  }

  stockLevelColorCodeAvailable(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyAvailable').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'amber'; }
    if (value >= 5) { return 'green'; }
  }

  responsiveActionOplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyOplus').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }
  responsiveActionOminus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyOminus').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }
  responsiveActionAplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyAplus').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }
  responsiveActionBplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyBplus').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }
  responsiveActionAvailable(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyAvailable').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }

  populateBranchDailyRequirements(item) {
    this.bloodStockManagementAnalysisForm.get('requirementsOplus').setValue(item.harareOplus);
    this.bloodStockManagementAnalysisForm.get('requirementsOminus').setValue(item.harareOminus);
    this.bloodStockManagementAnalysisForm.get('requirementsAplus').setValue(item.harareAplus);
    this.bloodStockManagementAnalysisForm.get('requirementsBplus').setValue(item.harareBplus);
  }

  populateStockavailable(item) {
    this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').setValue(
      item.rhPositiveWbOcompatibility + item.rhPositivePcOcompatibility + item.rhPositivePaedWbOcompatibility +
      item.rhPositivePaedPcOcompatibility + item.rhPositiveWbO + item.rhPositivePcO + item.rhPositivePaedWbO +
      item.rhPositivePaedPcO );
    this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').setValue(
      item.rhNegativeWbOcompatibility + item.rhNegativePcOcompatibility + item.rhNegativePaedWbOcompatibility +
      item.rhNegativePaedPcOcompatibility + item.rhNegativeWbO + item.rhNegativePcO + item.rhNegativePaedWbO +
      item.rhNegativePaedPcO );
    this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').setValue(
      item.rhPositiveWbAcompatibility + item.rhPositivePcAcompatibility + item.rhPositivePaedWbAcompatibility +
      item.rhPositivePaedPcAcompatibility + item.rhPositiveWbA + item.rhPositivePcA + item.rhPositivePaedWbA +
      item.rhPositivePaedPcA );
    this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').setValue(
      item.rhPositiveWbBcompatibility + item.rhPositivePcBcompatibility + item.rhPositivePaedWbBcompatibility +
      item.rhPositivePaedPcBcompatibility + item.rhPositiveWbB + item.rhPositivePcB + item.rhPositivePaedWbB +
      item.rhPositivePaedPcB );

    this.bloodStockManagementAnalysisForm.get('totalStockedUnitsAvailable').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').value
      + this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').value) * 0.6
      + (this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').value
      + this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').value) * 0.2);


    this.bloodStockManagementAnalysisForm.get('bdrAvailableStockTotal').setValue(
       ((this.noDaysRequiremets.harareOplus + this.noDaysRequiremets.harareOminus) * 0.6
       + (this.noDaysRequiremets.harareAplus + this.noDaysRequiremets.harareBplus) * 0.2).toFixed(0));

    this.bloodStockManagementAnalysisForm.get('daysSupplyOplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('requirementsOplus').value / this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyOminus').setValue(
      (this.bloodStockManagementAnalysisForm.get('requirementsOminus').value / this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyAplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('requirementsAplus').value / this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyBplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('requirementsBplus').value / this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').value).toFixed(2));
      this.bloodStockManagementAnalysisForm.get('daysSupplyAvailable').setValue(
        (this.bloodStockManagementAnalysisForm.get('totalStockedUnitsAvailable').value / this.bloodStockManagementAnalysisForm.get('bdrAvailableStockTotal').value).toFixed(2));


    this.bloodStockManagementAnalysisForm.get('weeksSupplyOplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyOplus').value / 7).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('weeksSupplyOminus').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyOminus').value / 7).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('weeksSupplyAplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyAplus').value / 7).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('weeksSupplyBplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyBplus').value / 7).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('weeksSupplyAvailable').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyAvailable').value / 7).toFixed(2));


    }

  getNoDaysRequrements() {
    this.dataManService.getNoDaysRequiremets().subscribe(
      result => {
        this.noDaysRequiremets = result;
        this.populateBranchDailyRequirements(this.noDaysRequiremets);
      }, error => {
        console.log(error.error);
      },
    );
  }
  getBranchDailyMinimalCapacity() {
    this.dataManService.getBranchDailyMinimalCapacity().subscribe(
      result => {
        this.branchDailyMinimalCapacity = result;
      }, error => {
        console.log(error.error);
      },
    );
  }

  getAvailableStockForm() {
    this.availableStockService.getAvailableStock(this.branchId).subscribe(
      result => {
        this.stockAvailable = result;
        this.populateStockavailable(this.stockAvailable);
      }, error => {
        console.log(error.error);
      },
    );
  }

  getQuarantinedStock() {
    this.qStockSevice.getAvailableStock(this.branchId).subscribe(
      result => {
        this.stockQuarantine = result;
        console.log(this.stockQuarantine);

        this.bloodStockManagementAnalysisForm.get('totalStockedUnitsQuarantined').setValue(
          (this.stockQuarantine.totalCollections + this.stockQuarantine.totalReceiptsFromBranches
            - this.stockQuarantine.totalIssuesDiscards - this.stockQuarantine.totalIssues) * 0.42);

      }, error => {
        console.log(error.error);
      },
    );
  }




}
