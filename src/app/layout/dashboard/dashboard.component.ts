
import { Component, OnInit } from '@angular/core';
import { map, first } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { StorageKey } from 'src/app/util/key';
// import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';
import { DataManagementService } from '../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NoDaysRequiremets } from '../../shared/config/model/admin/no-days-requirements.model';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';
import { resultMemoize } from '@ngrx/store';
import { StockAvailable } from 'src/app/shared/config/model/stock-available.model';
import { QuarantinedStockService } from '../../shared/config/service/quarantined-stock.service';
import { StockQuarantined } from '../../shared/config/model/Stock-quarantined.model';
import { BranchService } from '../../shared/config/service/admin/branch.service';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // date = new FormControl(new Date().toLocaleDateString());
  /** Based on the screen size, switch from standard to one column per row */
  column = 2;
  fontSize;
  iconSize;
  dashForm: FormGroup;
  color = 'blue';
  bloodStockManagementAnalysisForm: FormGroup;
  noDaysRequiremets: NoDaysRequiremets;
  branchDailyMinimalCapacity: BranchDailyMinimalCapacity = new BranchDailyMinimalCapacity();
  stockAvailable: StockAvailable = new StockAvailable();
  stockQuarantine: StockQuarantined = new StockQuarantined();
  branchId: number;
  allBranches: Branch[] = [];
  formFilter: any = { branchName: '' };
  selectedBranches: any[] = [];
  branchesInfo: any = {};
  yesterdayDate: Date;
  roles: string[];
  util;
  collections = 0;
  firstRun = true;
  branches = 'bhoo zvese';
  branchInfoAvailable = false;
  unsubmitedQuarantine = 0;
  unsubmitedAvailable = 0;
  numberOfCollections: number;


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dataManService: DataManagementService,
              private fb: FormBuilder, private availableStockService: AvailableStockService, private branchService: BranchService,
              private dashService: DashboardService, private qStockSevice: QuarantinedStockService, private snotify: SnotifyService) { }
  redirect(value) {
    this.router.navigate([value]);
  }


  ngOnInit(): void {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.setYesterdayDate();
    this.createFormBloodStockManagementAnalysisForm();
    // this.getNoDaysRequrements();
    this.getAvailableStockForm();
    this.getQuarantinedStock();
    this.getBranchDailyMinimalCapacity();
    this.createFilterDataForm();
    this.getAllUnSubmitedQuarantineStock();
    this.getAllUnSubmitedAvailableStock();
    this.util = new NotifyUtil(this.snotify);

    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    if (this.roles.includes('ROLE_USER') || this.roles.includes('ROLE_SUPERVISOR')) {
      this.getUserBranch();
    } else {
      this.getAllBranches();
  }
  }

  createFormBloodStockManagementAnalysisForm() {
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
      bdrStockedUnitsQuarantined: new FormControl(),
      daysSupplyStockedUnitsQuarantined: new FormControl(),
      weeksSupplyQuarantine: new FormControl(),
    });
  }
  createFilterDataForm() {
    this.dashForm = this.fb.group({
      date : new FormControl(this.yesterdayDate),
      branches: new FormControl(this.selectedBranches),
    });
  }

  getUserBranch() {
    this.branchService.getUsersBranch().subscribe(
      result => {
        this.allBranches.push(result);
        this.getBranchInfo();
       },
       error => {
         console.log(error.error);
       }
    );
  }

  getAllBranches() {

    this.branchService.getAll().subscribe(
      result => {
       this.allBranches = result;
       this.getBranchInfo();
      },
      error => {
        console.log(error.error);
      }
    );
  }

  getDate(value) {
    value.branches = this.selectedBranches;
    console.log(value);
    if (this.selectedBranches.length > 0) {
      this.dashService.getBranchInfoByDate(value).subscribe(
      result => {
        this.branchesInfo = result;
        console.log(this.branchesInfo);
        this.overallCollections(this.branchesInfo);
        this.populateBranchDailyRequirements(this.branchesInfo);
        this.populateStockavailable(this.branchesInfo);
      }
    );
  } else {
    console.log('please select Branch');
    this.snotify.error('please select Branch', 'Error', this.util.getNotifyConfig());
  }
  }

  setYesterdayDate() {
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    this.yesterdayDate = yDate;
    console.log(this.yesterdayDate);
  }

  toggleForm(value: any, i) {
    console.log(i);
    if ( !this.selectedBranches.find(c => c === value)) {
      this.selectedBranches.push(value);
     } else {
       this.selectedBranches = this.selectedBranches.filter(obj => obj !== value);
     }
    console.log(this.selectedBranches);

  }

  overallCollections(value) {
    console.log(this.selectedBranches);
    if (value === null || undefined) {return 0; }
    let avarage = 0;
    let bloodnumber = 0;
    let x = 0;

    if (this.selectedBranches.length === 0) { this.selectedBranches = this.allBranches; this.firstRun = true; }
    this.selectedBranches.forEach(item => {
      if (item.branchName === 'HARARE') {if (value.collectionsHarare !== 0 && value.harareTotalMinCap !== 0) {
        bloodnumber += value.collectionsHarare;
        avarage += value.collectionsHarare / value.harareTotalMinCap; x++; } }
      if (item.branchName === 'BULAWAYO') {if (value.collectionsBulawayo !== 0 && value.bulawayoTotalMinCap !== 0) {
        bloodnumber += value.collectionsBulawayo;
        avarage += value.collectionsBulawayo / value.bulawayoTotalMinCap; x++; } }
      if (item.branchName === 'GWERU') {if (value.collectionsGweru !== 0 && value.gweruTotalMinCap !== 0) {
        bloodnumber += value.collectionsGweru;
        avarage += value.collectionsGweru / value.gweruTotalMinCap; x++; } }
      if (item.branchName === 'MUTARE') {if (value.collectionsMutare !== 0 && value.mutareTotalMinCap !== 0) {
        bloodnumber += value.collectionsMutare;
        avarage += value.collectionsMutare / value.mutareTotalMinCap; x++; } }
      if (item.branchName === 'MASVINGO') {if (value.collectionsMasvingo !== 0 && value.masvingoTotalMinCap !== 0) {
        bloodnumber += value.collectionsMasvingo;
        avarage += value.collectionsMasvingo / value.masvingoTotalMinCap; x++; } }
    });
    this.numberOfCollections = bloodnumber;
    this.collections =  Number(((avarage / x) * 100).toFixed(2)) ;

    if (this.firstRun) { this.selectedBranches = []; this.firstRun = false; } // so that the statement
    // this.selectedBranches = this.allBranches; is only run on init and not ebery time this method id called
  }


  getBranchInfo() {
    const value = this.dashForm.value;
    if (this.selectedBranches.length === 0) {
      value.branches = this.allBranches;
    } else {
      value.branches = this.selectedBranches;
    }
    console.log(this.selectedBranches);
    this.dashService.getBranchInfoByDate(value).subscribe(
      result => {
        this.branchesInfo = result;
        this.overallCollections(this.branchesInfo);
        this.populateBranchDailyRequirements(this.branchesInfo);
        this.populateStockavailable(this.branchesInfo);
        this.branchInfoAvailable = true;
    },
    error => {
      console.log(error.error);
    });
  }
  collectionsBgColor() {
    let value =  this.collections;
    if (value !== undefined && value !== null) {
      if (value >= 1) { return 'purple'; }
      if (value >= 0.75 && value < 1) { return 'green'; }
      if (value >= 0.4 && value < 0.75) { return 'orange'; }
      if ( value < 0.4) { return 'red'; } else { return 'pink'; }
    // }
  }
}
  demandVsSupplyBgColor() {
    let value;
    value = (this.branchesInfo.supplies / this.branchesInfo.orders);
    if (value !== undefined && value !== null) {
      if (value >= 0.5) { return 'green'; }
      if (value >= 0.25 && value < 0.5) { return 'orange'; }
      if (value >= 0 && value < 0.25) { return 'red'; } else { return 'pink'; }
  }
  }

  bsmsBgColor() {
    let value = this.branchesInfo.bsms;
    if (this.branchesInfo.bsms !== undefined && this.branchesInfo.bsms !== null) {
      if (value >= 0.5) { return 'green'; }
      if (value >= 0.25 && value < 0.5) { return 'orange'; }
      if (value >= 0 && value < 0.25) { return 'red'; } else { return 'pink'; }
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
    if (value > 2 && value < 5) {return 'orange'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeAplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyAplus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'orange'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeBplus(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyBplus').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'orange'; }
    if (value >= 5) { return 'green'; }
  }

  stockLevelColorCodeAvailable(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyAvailable').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'orange'; }
    if (value >= 5) { return 'green'; }
  }
  stockLevelColorCodeQuarantine(): string {
    const value = this.bloodStockManagementAnalysisForm.get('daysSupplyStockedUnitsQuarantined').value;
    if (value <= 2) {return 'red'; }
    if (value > 2 && value < 5) {return 'orange'; }
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
  responsiveActionQuarantine(): string {
    const value = this.bloodStockManagementAnalysisForm.get('weeksSupplyQuarantine').value;
    if (value <= 3) {return 'Collect / clear quarantine'; } else {return 'Stagger collections'; }
  }

  populateBranchDailyRequirements(item) {
    this.bloodStockManagementAnalysisForm.get('requirementsOplus').setValue(item.dailyReqOplus);
    this.bloodStockManagementAnalysisForm.get('requirementsOminus').setValue(item.dailyReqOminus);
    this.bloodStockManagementAnalysisForm.get('requirementsAplus').setValue(item.dailyReqAplus);
    this.bloodStockManagementAnalysisForm.get('requirementsBplus').setValue(item.dailyReqBplus);
    this.bloodStockManagementAnalysisForm.get('bdrStockedUnitsQuarantined').setValue(
    Math.round((this.bloodStockManagementAnalysisForm.get('requirementsOplus').value
    + this.bloodStockManagementAnalysisForm.get('requirementsOminus').value
    + this.bloodStockManagementAnalysisForm.get('requirementsAplus').value
    + this.bloodStockManagementAnalysisForm.get('requirementsBplus').value) * 0.435)
    );
  }

  populateStockavailable(item) {
    this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').setValue(item.stockedOplus);
    this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').setValue(item.stockedOminus);
    this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').setValue(item.stockedAplus);
    this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').setValue(item.stockedBplus);

    this.bloodStockManagementAnalysisForm.get('totalStockedUnitsAvailable').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').value
      + this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').value) * 0.6
      + (this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').value
      + this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').value) * 0.2);

    this.bloodStockManagementAnalysisForm.get('totalStockedUnitsQuarantined').setValue(item.quarantineStock * 0.42);

    this.bloodStockManagementAnalysisForm.get('bdrAvailableStockTotal').setValue(
       (( this.bloodStockManagementAnalysisForm.get('requirementsOplus').value
       + this.bloodStockManagementAnalysisForm.get('requirementsOminus').value) * 0.6
       + (this.bloodStockManagementAnalysisForm.get('requirementsAplus').value
       + this.bloodStockManagementAnalysisForm.get('requirementsBplus').value) * 0.2).toFixed(0));

    this.bloodStockManagementAnalysisForm.get('daysSupplyOplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsOplus').value
      / this.bloodStockManagementAnalysisForm.get('requirementsOplus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyOminus').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsOminus').value
      / this.bloodStockManagementAnalysisForm.get('requirementsOminus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyAplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsAplus').value
      / this.bloodStockManagementAnalysisForm.get('requirementsAplus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyBplus').setValue(
      (this.bloodStockManagementAnalysisForm.get('stockedUnitsBplus').value
      / this.bloodStockManagementAnalysisForm.get('requirementsBplus').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyAvailable').setValue(
        (this.bloodStockManagementAnalysisForm.get('totalStockedUnitsAvailable').value
        / this.bloodStockManagementAnalysisForm.get('bdrAvailableStockTotal').value).toFixed(2));
    this.bloodStockManagementAnalysisForm.get('daysSupplyStockedUnitsQuarantined').setValue(
        (this.bloodStockManagementAnalysisForm.get('totalStockedUnitsQuarantined').value
        / this.bloodStockManagementAnalysisForm.get('bdrStockedUnitsQuarantined').value).toFixed(2));


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
    this.bloodStockManagementAnalysisForm.get('weeksSupplyQuarantine').setValue(
      (this.bloodStockManagementAnalysisForm.get('daysSupplyStockedUnitsQuarantined').value / 7).toFixed(2));


    }

  getNoDaysRequrements() {
    this.dataManService.getNoDaysRequiremets().subscribe(
      result => {
        this.noDaysRequiremets = result;
        // this.populateBranchDailyRequirements(this.noDaysRequiremets);
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
        console.log(this.stockAvailable);
        if (this.stockAvailable !== null ) {
        this.populateStockavailable(this.stockAvailable);
        }
      }, error => {
        console.log(error.error);
      },
    );
  }

  getQuarantinedStock() {
    this.qStockSevice.getAvailableStock(this.branchId).subscribe(
      result => {
        this.stockQuarantine = result;
        if (this.stockQuarantine !== null ) {
           this.bloodStockManagementAnalysisForm.get('totalStockedUnitsQuarantined').setValue(
          (this.stockQuarantine.totalCollections + this.stockQuarantine.totalReceiptsFromBranches
            - this.stockQuarantine.totalIssuesDiscards - this.stockQuarantine.totalIssues) * 0.42);
        }
      }, error => {
        console.log(error.error);
      },
    );
  }

  getAllUnSubmitedQuarantineStock():number {
    this.qStockSevice.getAvailableStockByActive().subscribe(
      result => {
        console.log(result);
        this.unsubmitedQuarantine = result;
      }
    );
    return this.unsubmitedQuarantine;
  }

  getAllUnSubmitedAvailableStock() {
    this.availableStockService.getAvailableStockByActive().subscribe(
      result => {
        console.log(result);
        this.unsubmitedAvailable = result;
      }
    );
  }

}
