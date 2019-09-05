import { Component, OnInit, Input } from '@angular/core';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Branch } from '../../shared/config/model/admin/branch.model';
import { BranchService } from 'src/app/shared/config/service/admin/branch.service';
import { StockAvailable } from 'src/app/shared/config/model/stock-available.model';
import { UserService } from '../../shared/config/service/admin/user.service';
import { StorageKey } from 'src/app/util/key';
import { DatePipe } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-stock-available',
  templateUrl: './stock-available.component.html',
  styleUrls: ['./stock-available.component.css']
})
export class StockAvailableComponent implements OnInit {
  availableStockForm: FormGroup;
  branches: Branch[];
  userBranch: Branch;
  branchesSize: number;
  stockAvailable: StockAvailable = new StockAvailable();
  branch: object;
  issuedToTotal: number;
  cardStockAvailable = 0;
  totalReceivedIssues = 0;
  totalReceivedStock = 0;
  branchId: number;
  AllBranches: Branch[];
  roles: string[];
  selected: Branch;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  editBranches = true;
  util;
  yesterdayDate: Date;
  editForm = true;
  showEditBtn = false;
  percentDemandVsSupply = 0;
  user = localStorage.getItem('USER');

  constructor(private availableStockService: AvailableStockService, private fb: FormBuilder,
              private branchService: BranchService, private userService: UserService, private snotify: SnotifyService) {
              }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.getUserBranch();
    this.setYesterdayDate();
    this.createForms();
    this.loadBranches(this.branchId);
    this.getAllBranches();
    this.getInitvalues(this.branchId);
    this.util = new NotifyUtil(this.snotify);

    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    if (this.roles.includes('ROLE_GLOBAL') || this.roles.includes('ROLE_SUPERVISOR')) {
      this.editBranches = false; }

  }

  setYesterdayDate() {
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    this.yesterdayDate = yDate;
  }

  createForms() {
    this.availableStockForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      // active: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branch: new FormControl(
        {disabled: this.editBranches}),
      todaysDate: new FormControl(this.yesterdayDate),
      openingStock: new FormControl(),
      receivedFromQuarantine: new FormControl(),
      totalAvailable: new FormControl(),
      totalReceipts: new FormControl(),
      hospitals: new FormControl(),
      receicedFromQuarantine: new FormControl(),
      issueToCompats: new FormControl(),
      expired: new FormControl(),
      disasters: new FormControl(),
      haemolysed_clots_other: new FormControl(),
      wholeBloodToPackedCells: new FormControl(),
      totalIssues: new FormControl(),
      totalHospitalOrders: new FormControl(),
      totalTransfersToOtherBranches: new FormControl(),
      currentAvailableStock: new FormControl(),
      overallSupplies: new FormControl(),
      overallOrders: new FormControl(),
      overallDemandVsSupply: new FormControl(),
      rhPositiveWbO: new FormControl(),
      rhPositivePcO: new FormControl(),
      rhPositivePaedWbO: new FormControl(),
      rhPositivePaedPcO: new FormControl(),
      rhNegativeWbO: new FormControl(),
      rhNegativePcO: new FormControl(),
      rhNegativePaedWbO: new FormControl(),
      rhNegativePaedPcO: new FormControl(),
      totalO: new FormControl(),
      percentagefTotalO: new FormControl(),
      rhPositiveWbA: new FormControl(),
      rhPositivePcA: new FormControl(),
      rhPositivePaedWbA: new FormControl(),
      rhPositivePaedPcA: new FormControl(),
      rhNegativeWbA: new FormControl(),
      rhNegativePcA: new FormControl(),
      rhNegativePaedWbA: new FormControl(),
      rhNegativePaedPcA: new FormControl(),
      totalA: new FormControl(),
      percentageOfTotalA: new FormControl(),
      rhPositiveWbB: new FormControl(),
      rhPositivePcB: new FormControl(),
      rhPositivePaedWbB: new FormControl(),
      rhPositivePaedPcB: new FormControl(),
      rhNegativeWbB: new FormControl(),
      rhNegativePcB: new FormControl(),
      rhNegativePaedWbB: new FormControl(),
      rhNegativePaedPcB: new FormControl(),
      totalB: new FormControl(),
      percentageOfTotalB: new FormControl(),
      rhPositiveWbAB: new FormControl(),
      rhPositivePcAB: new FormControl(),
      rhPositivePaedWbAB: new FormControl(),
      rhPositivePaedPcAB: new FormControl(),
      rhNegativeWbAB: new FormControl(),
      rhNegativePcAB: new FormControl(),
      rhNegativePaedWbAB: new FormControl(),
      rhNegativePaedPcAB: new FormControl(),
      totalAB: new FormControl(),
      percentageOfTotalAB: new FormControl(),
      totalRhPositiveWb: new FormControl(),
      totalRhPositivePc: new FormControl(),
      totalRhPositivePaedWb: new FormControl(),
      totalRhPositivePaedPc: new FormControl(),
      totalRhNegativeWb: new FormControl(),
      totalRhNegativePc: new FormControl(),
      totalRhNegativePaedWb: new FormControl(),
      totalRhNegativePaedPc: new FormControl(),
      totalTotal: new FormControl(),
      totalPercentageOfTotal: new FormControl(),
      rhPositiveWbOcompatibility: new FormControl(),
      rhPositivePcOcompatibility: new FormControl(),
      rhPositivePaedWbOcompatibility: new FormControl(),
      rhPositivePaedPcOcompatibility: new FormControl(),
      rhNegativeWbOcompatibility: new FormControl(),
      rhNegativePcOcompatibility: new FormControl(),
      rhNegativePaedWbOcompatibility: new FormControl(),
      rhNegativePaedPcOcompatibility: new FormControl(),
      totalOcompatibility: new FormControl(),
      percentageOfTotalOcompatibility: new FormControl(),
      rhPositiveWbAcompatibility: new FormControl(),
      rhPositivePcAcompatibility: new FormControl(),
      rhPositivePaedWbAcompatibility: new FormControl(),
      rhPositivePaedPcAcompatibility: new FormControl(),
      rhNegativeWbAcompatibility: new FormControl(),
      rhNegativePcAcompatibility: new FormControl(),
      rhNegativePaedWbAcompatibility: new FormControl(),
      rhNegativePaedPcAcompatibility: new FormControl(),
      totalAcompatibility: new FormControl(),
      percentageOfTotalAcompatibility: new FormControl(),
      rhPositiveWbBcompatibility: new FormControl(),
      rhPositivePcBcompatibility: new FormControl(),
      rhPositivePaedWbBcompatibility: new FormControl(),
      rhPositivePaedPcBcompatibility: new FormControl(),
      rhNegativeWbBcompatibility: new FormControl(),
      rhNegativePcBcompatibility: new FormControl(),
      rhNegativePaedWbBcompatibility: new FormControl(),
      rhNegativePaedPcBcompatibility: new FormControl(),
      totalBcompatibility: new FormControl(),
      percentageOfTotalBcompatibility: new FormControl(),
      rhPositiveWbABcompatibility: new FormControl(),
      rhPositivePcABcompatibility: new FormControl(),
      rhPositivePaedWbABcompatibility: new FormControl(),
      rhPositivePaedPcABcompatibility: new FormControl(),
      rhNegativeWbABcompatibility: new FormControl(),
      rhNegativePcABcompatibility: new FormControl(),
      rhNegativePaedWbABcompatibility: new FormControl(),
      rhNegativePaedPcABcompatibility: new FormControl(),
      totalABcompatibility: new FormControl(),
      percentageOfTotalABcompatibility: new FormControl(),
      totalRhPositiveWbcompatibility: new FormControl(),
      totalRhPositivePccompatibility: new FormControl(),
      totalRhPositivePaedWbcompatibility: new FormControl(),
      totalRhPositivePaedPccompatibility: new FormControl(),
      totalRhNegativeWbcompatibility: new FormControl(),
      totalRhNegativePccompatibility: new FormControl(),
      totalRhNegativePaedWbcompatibility: new FormControl(),
      totalRhNegativePaedPccompatibility: new FormControl(),
      totalTotalcompatibility: new FormControl(),
      totalPercentageOfTotalcompatibility: new FormControl(),
      compatsIssues: new FormControl(),
      compatsOrders: new FormControl(),
      compatsPercentageSupply_Orders: new FormControl(),
      grandTotalWbPositive: new FormControl(),
      grandTotalPcPositive: new FormControl(),
      grandTotalPaedWbPositive: new FormControl(),
      grandTotalPaedPcPositive: new FormControl(),
      grandTotalWbNegative: new FormControl(),
      grandTotalPcNegative: new FormControl(),
      grandTotalPaedWbNegative: new FormControl(),
      grandTotalPaedPcNegative: new FormControl(),
      grandTotal: new FormControl(),
      ffp1: new FormControl(),
      plt1: new FormControl(),
      plt2: new FormControl(),
      cryo: new FormControl(),
      paedPacks: new FormControl(),
      checkedBy: new FormControl(),
      compiledBy: new FormControl(),
      receivedFromAvailable: this.fb.array([
        // this.initStockReceivedFrom()
      ]),
      issuedToAvailable: this.fb.array([
        // this.initStockIssuedTo()
      ])
    });
  }

getUserBranch(): Branch {
  this.branchService.getItem(this.branchId).subscribe(
    result => {
      this.selected = result;
    }
  );
  return this.selected;
}
compareAvailableTotals(): boolean {
  if (this.availableStockForm.get('totalTotal').value !== this.availableStockForm.get('currentAvailableStock').value) {
    return true;
  } else {
    return false;
  }
}
  populateNewForm() {
    this.availableStockForm.get('id').setValue('');
    this.availableStockForm.get('dateCreated').setValue('');
    this.availableStockForm.get('version').setValue('');
    this.availableStockForm.get('createdById').setValue('');
    // this.availableStockForm.reset();
    this.availableStockForm.get('openingStock').setValue('');
    this.availableStockForm.get('receivedFromQuarantine').setValue('');
    this.availableStockForm.get('totalAvailable').setValue('');
    this.availableStockForm.get('hospitals').setValue('');
    this.availableStockForm.get('receicedFromQuarantine').setValue('');
    this.availableStockForm.get('issueToCompats').setValue('');
    this.availableStockForm.get('expired').setValue('');
    this.availableStockForm.get('disasters').setValue('');
    this.availableStockForm.get('haemolysed_clots_other').setValue('');
    this.availableStockForm.get('wholeBloodToPackedCells').setValue('');
    this.availableStockForm.get('totalIssues').setValue('');
    this.availableStockForm.get('currentAvailableStock').setValue('');
    this.availableStockForm.get('totalTransfersToOtherBranches').setValue('');
    this.availableStockForm.get('totalHospitalOrders').setValue('');
    this.availableStockForm.get('rhPositiveWbO').setValue('');
    this.availableStockForm.get('rhPositivePcO').setValue('');
    this.availableStockForm.get('rhPositivePaedWbO').setValue('');
    this.availableStockForm.get('rhPositivePaedPcO').setValue('');
    this.availableStockForm.get('rhNegativeWbO').setValue('');
    this.availableStockForm.get('rhNegativePcO').setValue('');
    this.availableStockForm.get('rhNegativePaedWbO').setValue('');
    this.availableStockForm.get('rhNegativePaedPcO').setValue('');
    this.availableStockForm.get('totalO').setValue('');
    this.availableStockForm.get('percentagefTotalO').setValue('');
    this.availableStockForm.get('rhPositiveWbA').setValue('');
    this.availableStockForm.get('rhPositivePcA').setValue('');
    this.availableStockForm.get('rhPositivePaedWbA').setValue('');
    this.availableStockForm.get('rhPositivePaedPcA').setValue('');
    this.availableStockForm.get('rhNegativeWbA').setValue('');
    this.availableStockForm.get('rhNegativePcA').setValue('');
    this.availableStockForm.get('rhNegativePaedWbA').setValue('');
    this.availableStockForm.get('rhNegativePaedPcA').setValue('');
    this.availableStockForm.get('totalA').setValue('');
    this.availableStockForm.get('percentageOfTotalA').setValue('');
    this.availableStockForm.get('rhPositiveWbB').setValue('');
    this.availableStockForm.get('rhPositivePcB').setValue('');
    this.availableStockForm.get('rhPositivePaedWbB').setValue('');
    this.availableStockForm.get('rhPositivePaedPcB').setValue('');
    this.availableStockForm.get('rhNegativeWbB').setValue('');
    this.availableStockForm.get('rhNegativePcB').setValue('');
    this.availableStockForm.get('rhNegativePaedWbB').setValue('');
    this.availableStockForm.get('rhNegativePaedPcB').setValue('');
    this.availableStockForm.get('totalB').setValue('');
    this.availableStockForm.get('percentageOfTotalB').setValue('');
    this.availableStockForm.get('rhPositiveWbAB').setValue('');
    this.availableStockForm.get('rhPositivePcAB').setValue('');
    this.availableStockForm.get('rhPositivePaedWbAB').setValue('');
    this.availableStockForm.get('rhPositivePaedPcAB').setValue('');
    this.availableStockForm.get('rhNegativeWbAB').setValue('');
    this.availableStockForm.get('rhNegativePcAB').setValue('');
    this.availableStockForm.get('rhNegativePaedWbAB').setValue('');
    this.availableStockForm.get('rhNegativePaedPcAB').setValue('');
    this.availableStockForm.get('totalAB').setValue('');
    this.availableStockForm.get('percentageOfTotalAB').setValue('');
    this.availableStockForm.get('totalRhPositiveWb').setValue('');
    this.availableStockForm.get('totalRhPositivePc').setValue('');
    this.availableStockForm.get('totalRhPositivePaedWb').setValue('');
    this.availableStockForm.get('totalRhPositivePaedPc').setValue('');
    this.availableStockForm.get('totalRhNegativeWb').setValue('');
    this.availableStockForm.get('totalRhNegativePc').setValue('');
    this.availableStockForm.get('totalRhNegativePaedWb').setValue('');
    this.availableStockForm.get('totalRhNegativePaedPc').setValue('');
    this.availableStockForm.get('totalTotal').setValue('');
    this.availableStockForm.get('totalPercentageOfTotal').setValue('');
    this.availableStockForm.get('rhPositiveWbOcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePcOcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedWbOcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedPcOcompatibility').setValue('');
    this.availableStockForm.get('rhNegativeWbOcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePcOcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedWbOcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedPcOcompatibility').setValue('');
    this.availableStockForm.get('totalOcompatibility').setValue('');
    this.availableStockForm.get('percentageOfTotalOcompatibility').setValue('');
    this.availableStockForm.get('rhPositiveWbAcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePcAcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedWbAcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedPcAcompatibility').setValue('');
    this.availableStockForm.get('rhNegativeWbAcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePcAcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedWbAcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedPcAcompatibility').setValue('');
    this.availableStockForm.get('totalAcompatibility').setValue('');
    this.availableStockForm.get('percentageOfTotalAcompatibility').setValue('');
    this.availableStockForm.get('rhPositiveWbBcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePcBcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedWbBcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedPcBcompatibility').setValue('');
    this.availableStockForm.get('rhNegativeWbBcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePcBcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedWbBcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedPcBcompatibility').setValue('');
    this.availableStockForm.get('totalBcompatibility').setValue('');
    this.availableStockForm.get('percentageOfTotalBcompatibility').setValue('');
    this.availableStockForm.get('rhPositiveWbABcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePcABcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedWbABcompatibility').setValue('');
    this.availableStockForm.get('rhPositivePaedPcABcompatibility').setValue('');
    this.availableStockForm.get('rhNegativeWbABcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePcABcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedWbABcompatibility').setValue('');
    this.availableStockForm.get('rhNegativePaedPcABcompatibility').setValue('');
    this.availableStockForm.get('totalABcompatibility').setValue('');
    this.availableStockForm.get('percentageOfTotalABcompatibility').setValue('');
    this.availableStockForm.get('totalRhPositiveWbcompatibility').setValue('');
    this.availableStockForm.get('totalRhPositivePccompatibility').setValue('');
    this.availableStockForm.get('totalRhPositivePaedWbcompatibility').setValue('');
    this.availableStockForm.get('totalRhPositivePaedPccompatibility').setValue('');
    this.availableStockForm.get('totalRhNegativeWbcompatibility').setValue('');
    this.availableStockForm.get('totalRhNegativePccompatibility').setValue('');
    this.availableStockForm.get('totalRhNegativePaedWbcompatibility').setValue('');
    this.availableStockForm.get('totalRhNegativePaedPccompatibility').setValue('');
    this.availableStockForm.get('totalTotalcompatibility').setValue('');
    this.availableStockForm.get('totalPercentageOfTotalcompatibility').setValue('');
    this.availableStockForm.get('compatsIssues').setValue('');
    this.availableStockForm.get('compatsOrders').setValue('');
    this.availableStockForm.get('compatsPercentageSupply_Orders').setValue('');
    this.availableStockForm.get('overallSupplies').setValue('');
    this.availableStockForm.get('overallOrders').setValue('');
    this.availableStockForm.get('overallDemandVsSupply').setValue('');
    this.availableStockForm.get('grandTotalWbPositive').setValue('');
    this.availableStockForm.get('grandTotalPcPositive').setValue('');
    this.availableStockForm.get('grandTotalPaedWbPositive').setValue('');
    this.availableStockForm.get('grandTotalPaedPcPositive').setValue('');
    this.availableStockForm.get('grandTotalWbNegative').setValue('');
    this.availableStockForm.get('grandTotalPcNegative').setValue('');
    this.availableStockForm.get('grandTotalPaedWbNegative').setValue('');
    this.availableStockForm.get('grandTotalPaedPcNegative').setValue('');
    this.availableStockForm.get('grandTotal').setValue('');
    this.availableStockForm.get('ffp1').setValue('');
    this.availableStockForm.get('plt1').setValue('');
    this.availableStockForm.get('plt2').setValue('');
    this.availableStockForm.get('cryo').setValue('');
    this.availableStockForm.get('paedPacks').setValue('');
    this.availableStockForm.get('receivedFromAvailable').reset();
    this.availableStockForm.get('issuedToAvailable').reset();
  }
  populateForm(item) {
    this.availableStockForm.get('id').setValue(item.id);
    this.availableStockForm.get('dateCreated').setValue(item.dateCreated);
    this.availableStockForm.get('version').setValue(item.version);
    // this.availableStockForm.get('active').setValue(item.active);
    this.availableStockForm.get('createdById').setValue(item.createdById);
    this.availableStockForm.get('openingStock').setValue(item.openingStock);
    this.availableStockForm.get('receivedFromQuarantine').setValue(item.receivedFromQuarantine);
    this.availableStockForm.get('totalAvailable').setValue(item.totalAvailable);
    this.availableStockForm.get('totalReceipts').setValue(item.totalReceipts);
    this.availableStockForm.get('hospitals').setValue(item.hospitals);
    this.availableStockForm.get('receicedFromQuarantine').setValue(item.receicedFromQuarantine);
    this.availableStockForm.get('issueToCompats').setValue(item.issueToCompats);
    this.availableStockForm.get('expired').setValue(item.expired);
    this.availableStockForm.get('disasters').setValue(item.disasters);
    this.availableStockForm.get('haemolysed_clots_other').setValue(item.haemolysed_clots_other);
    this.availableStockForm.get('wholeBloodToPackedCells').setValue(item.wholeBloodToPackedCells);
    this.availableStockForm.get('totalIssues').setValue(item.totalIssues);
    this.availableStockForm.get('totalHospitalOrders').setValue(item.totalHospitalOrders);
    this.availableStockForm.get('currentAvailableStock').setValue(item.currentAvailableStock);
    this.availableStockForm.get('totalTransfersToOtherBranches').setValue(item.totalTransfersToOtherBranches);
    this.availableStockForm.get('rhPositiveWbO').setValue(item.rhPositiveWbO);
    this.availableStockForm.get('rhPositivePcO').setValue(item.rhPositivePcO);
    this.availableStockForm.get('rhPositivePaedWbO').setValue(item.rhPositivePaedWbO);
    this.availableStockForm.get('rhPositivePaedPcO').setValue(item.rhPositivePaedPcO);
    this.availableStockForm.get('rhNegativeWbO').setValue(item.rhNegativeWbO);
    this.availableStockForm.get('rhNegativePcO').setValue(item.rhNegativePcO);
    this.availableStockForm.get('rhNegativePaedWbO').setValue(item.rhNegativePaedWbO);
    this.availableStockForm.get('rhNegativePaedPcO').setValue(item.rhNegativePaedPcO);
    this.availableStockForm.get('totalO').setValue(item.totalO);
    this.availableStockForm.get('percentagefTotalO').setValue(item.percentagefTotalO);
    this.availableStockForm.get('rhPositiveWbA').setValue(item.rhPositiveWbA);
    this.availableStockForm.get('rhPositivePcA').setValue(item.rhPositivePcA);
    this.availableStockForm.get('rhPositivePaedWbA').setValue(item.rhPositivePaedWbA);
    this.availableStockForm.get('rhPositivePaedPcA').setValue(item.rhPositivePaedPcA);
    this.availableStockForm.get('rhNegativeWbA').setValue(item.rhNegativeWbA);
    this.availableStockForm.get('rhNegativePcA').setValue(item.rhNegativePcA);
    this.availableStockForm.get('rhNegativePaedWbA').setValue(item.rhNegativePaedWbA);
    this.availableStockForm.get('rhNegativePaedPcA').setValue(item.rhNegativePaedPcA);
    this.availableStockForm.get('totalA').setValue(item.totalA);
    this.availableStockForm.get('percentageOfTotalA').setValue(item.percentageOfTotalA);
    this.availableStockForm.get('rhPositiveWbB').setValue(item.rhPositiveWbB);
    this.availableStockForm.get('rhPositivePcB').setValue(item.rhPositivePcB);
    this.availableStockForm.get('rhPositivePaedWbB').setValue(item.rhPositivePaedWbB);
    this.availableStockForm.get('rhPositivePaedPcB').setValue(item.rhPositivePaedPcB);
    this.availableStockForm.get('rhNegativeWbB').setValue(item.rhNegativeWbB);
    this.availableStockForm.get('rhNegativePcB').setValue(item.rhNegativePcB);
    this.availableStockForm.get('rhNegativePaedWbB').setValue(item.rhNegativePaedWbB);
    this.availableStockForm.get('rhNegativePaedPcB').setValue(item.rhNegativePaedPcB);
    this.availableStockForm.get('totalB').setValue(item.totalB);
    this.availableStockForm.get('percentageOfTotalB').setValue(item.percentageOfTotalB);
    this.availableStockForm.get('rhPositiveWbAB').setValue(item.rhPositiveWbAB);
    this.availableStockForm.get('rhPositivePcAB').setValue(item.rhPositivePcAB);
    this.availableStockForm.get('rhPositivePaedWbAB').setValue(item.rhPositivePaedWbAB);
    this.availableStockForm.get('rhPositivePaedPcAB').setValue(item.rhPositivePaedPcAB);
    this.availableStockForm.get('rhNegativeWbAB').setValue(item.rhNegativeWbAB);
    this.availableStockForm.get('rhNegativePcAB').setValue(item.rhNegativePcAB);
    this.availableStockForm.get('rhNegativePaedWbAB').setValue(item.rhNegativePaedWbAB);
    this.availableStockForm.get('rhNegativePaedPcAB').setValue(item.rhNegativePaedPcAB);
    this.availableStockForm.get('totalAB').setValue(item.totalAB);
    this.availableStockForm.get('percentageOfTotalAB').setValue(item.percentageOfTotalAB);
    this.availableStockForm.get('totalRhPositiveWb').setValue(item.totalRhPositiveWb);
    this.availableStockForm.get('totalRhPositivePc').setValue(item.totalRhPositivePc);
    this.availableStockForm.get('totalRhPositivePaedWb').setValue(item.totalRhPositivePaedWb);
    this.availableStockForm.get('totalRhPositivePaedPc').setValue(item.totalRhPositivePaedPc);
    this.availableStockForm.get('totalRhNegativeWb').setValue(item.totalRhNegativeWb);
    this.availableStockForm.get('totalRhNegativePc').setValue(item.totalRhNegativePc);
    this.availableStockForm.get('totalRhNegativePaedWb').setValue(item.totalRhNegativePaedWb);
    this.availableStockForm.get('totalRhNegativePaedPc').setValue(item.totalRhNegativePaedPc);
    this.availableStockForm.get('totalTotal').setValue(item.totalTotal);
    this.availableStockForm.get('totalPercentageOfTotal').setValue(item.totalPercentageOfTotal);
    this.availableStockForm.get('rhPositiveWbOcompatibility').setValue(item.rhPositiveWbOcompatibility);
    this.availableStockForm.get('rhPositivePcOcompatibility').setValue(item.rhPositivePcOcompatibility);
    this.availableStockForm.get('rhPositivePaedWbOcompatibility').setValue(item.rhPositivePaedWbOcompatibility);
    this.availableStockForm.get('rhPositivePaedPcOcompatibility').setValue(item.rhPositivePaedPcOcompatibility);
    this.availableStockForm.get('rhNegativeWbOcompatibility').setValue(item.rhNegativeWbOcompatibility);
    this.availableStockForm.get('rhNegativePcOcompatibility').setValue(item.rhNegativePcOcompatibility);
    this.availableStockForm.get('rhNegativePaedWbOcompatibility').setValue(item.rhNegativePaedWbOcompatibility);
    this.availableStockForm.get('rhNegativePaedPcOcompatibility').setValue(item.rhNegativePaedPcOcompatibility);
    this.availableStockForm.get('totalOcompatibility').setValue(item.totalOcompatibility);
    this.availableStockForm.get('percentageOfTotalOcompatibility').setValue(item.percentageOfTotalOcompatibility);
    this.availableStockForm.get('rhPositiveWbAcompatibility').setValue(item.rhPositiveWbAcompatibility);
    this.availableStockForm.get('rhPositivePcAcompatibility').setValue(item.rhPositivePcAcompatibility);
    this.availableStockForm.get('rhPositivePaedWbAcompatibility').setValue(item.rhPositivePaedWbAcompatibility);
    this.availableStockForm.get('rhPositivePaedPcAcompatibility').setValue(item.rhPositivePaedPcAcompatibility);
    this.availableStockForm.get('rhNegativeWbAcompatibility').setValue(item.rhNegativeWbAcompatibility);
    this.availableStockForm.get('rhNegativePcAcompatibility').setValue(item.rhNegativePcAcompatibility);
    this.availableStockForm.get('rhNegativePaedWbAcompatibility').setValue(item.rhNegativePaedWbAcompatibility);
    this.availableStockForm.get('rhNegativePaedPcAcompatibility').setValue(item.rhNegativePaedPcAcompatibility);
    this.availableStockForm.get('totalAcompatibility').setValue(item.totalAcompatibility);
    this.availableStockForm.get('percentageOfTotalAcompatibility').setValue(item.percentageOfTotalAcompatibility);
    this.availableStockForm.get('rhPositiveWbBcompatibility').setValue(item.rhPositiveWbBcompatibility);
    this.availableStockForm.get('rhPositivePcBcompatibility').setValue(item.rhPositivePcBcompatibility);
    this.availableStockForm.get('rhPositivePaedWbBcompatibility').setValue(item.rhPositivePaedWbBcompatibility);
    this.availableStockForm.get('rhPositivePaedPcBcompatibility').setValue(item.rhPositivePaedPcBcompatibility);
    this.availableStockForm.get('rhNegativeWbBcompatibility').setValue(item.rhNegativeWbBcompatibility);
    this.availableStockForm.get('rhNegativePcBcompatibility').setValue(item.rhNegativePcBcompatibility);
    this.availableStockForm.get('rhNegativePaedWbBcompatibility').setValue(item.rhNegativePaedWbBcompatibility);
    this.availableStockForm.get('rhNegativePaedPcBcompatibility').setValue(item.rhNegativePaedPcBcompatibility);
    this.availableStockForm.get('totalBcompatibility').setValue(item.totalBcompatibility);
    this.availableStockForm.get('percentageOfTotalBcompatibility').setValue(item.percentageOfTotalBcompatibility);
    this.availableStockForm.get('rhPositiveWbABcompatibility').setValue(item.rhPositiveWbABcompatibility);
    this.availableStockForm.get('rhPositivePcABcompatibility').setValue(item.rhPositivePcABcompatibility);
    this.availableStockForm.get('rhPositivePaedWbABcompatibility').setValue(item.rhPositivePaedWbABcompatibility);
    this.availableStockForm.get('rhPositivePaedPcABcompatibility').setValue(item.rhPositivePaedPcABcompatibility);
    this.availableStockForm.get('rhNegativeWbABcompatibility').setValue(item.rhNegativeWbABcompatibility);
    this.availableStockForm.get('rhNegativePcABcompatibility').setValue(item.rhNegativePcABcompatibility);
    this.availableStockForm.get('rhNegativePaedWbABcompatibility').setValue(item.rhNegativePaedWbABcompatibility);
    this.availableStockForm.get('rhNegativePaedPcABcompatibility').setValue(item.rhNegativePaedPcABcompatibility);
    this.availableStockForm.get('totalABcompatibility').setValue(item.totalABcompatibility);
    this.availableStockForm.get('percentageOfTotalABcompatibility').setValue(item.percentageOfTotalABcompatibility);
    this.availableStockForm.get('totalRhPositiveWbcompatibility').setValue(item.totalRhPositiveWbcompatibility);
    this.availableStockForm.get('totalRhPositivePccompatibility').setValue(item.totalRhPositivePccompatibility);
    this.availableStockForm.get('totalRhPositivePaedWbcompatibility').setValue(item.totalRhPositivePaedWbcompatibility);
    this.availableStockForm.get('totalRhPositivePaedPccompatibility').setValue(item.totalRhPositivePaedPccompatibility);
    this.availableStockForm.get('totalRhNegativeWbcompatibility').setValue(item.totalRhNegativeWbcompatibility);
    this.availableStockForm.get('totalRhNegativePccompatibility').setValue(item.totalRhNegativePccompatibility);
    this.availableStockForm.get('totalRhNegativePaedWbcompatibility').setValue(item.totalRhNegativePaedWbcompatibility);
    this.availableStockForm.get('totalRhNegativePaedPccompatibility').setValue(item.totalRhNegativePaedPccompatibility);
    this.availableStockForm.get('totalTotalcompatibility').setValue(item.totalTotalcompatibility);
    this.availableStockForm.get('totalPercentageOfTotalcompatibility').setValue(item.totalPercentageOfTotalcompatibility);
    this.availableStockForm.get('compatsIssues').setValue(item.compatsIssues);
    this.availableStockForm.get('compatsOrders').setValue(item.compatsOrders);
    this.availableStockForm.get('compatsPercentageSupply_Orders').setValue(item.compatsPercentageSupply_Orders);
    this.availableStockForm.get('overallSupplies').setValue(item.verallSupplies);
    this.availableStockForm.get('overallOrders').setValue(item.overallOrders);
    this.availableStockForm.get('overallDemandVsSupply').setValue(item.overallDemandVsSupply);
    this.availableStockForm.get('grandTotalWbPositive').setValue(item.grandTotalWbPositive);
    this.availableStockForm.get('grandTotalPcPositive').setValue(item.grandTotalPcPositive);
    this.availableStockForm.get('grandTotalPaedWbPositive').setValue(item.grandTotalPaedWbPositive);
    this.availableStockForm.get('grandTotalPaedPcPositive').setValue(item.grandTotalPaedPcPositive);
    this.availableStockForm.get('grandTotalWbNegative').setValue(item.grandTotalWbNegative);
    this.availableStockForm.get('grandTotalPcNegative').setValue(item.grandTotalPcNegative);
    this.availableStockForm.get('grandTotalPaedWbNegative').setValue(item.grandTotalPaedWbNegative);
    this.availableStockForm.get('grandTotalPaedPcNegative').setValue(item.grandTotalPaedPcNegative);
    this.availableStockForm.get('grandTotal').setValue(item.grandTotal);
    this.availableStockForm.get('ffp1').setValue(item.ffp1);
    this.availableStockForm.get('plt1').setValue(item.plt1);
    this.availableStockForm.get('plt2').setValue(item.plt2);
    this.availableStockForm.get('cryo').setValue(item.cryo);
    this.availableStockForm.get('paedPacks').setValue(item.paedPacks);
    // this.availableStockForm.get('branchName').setValue(item.brancName);

    if (item.receivedFromAvailable !== null && item.receivedFromAvailable !== undefined) {
    this.availableStockForm.get('receivedFromAvailable').reset();
    if (item.receivedFromAvailable.length > 0) {
      item.receivedFromAvailable.forEach(element => {
        this.StockReceivedFromArray.removeAt(0);
      });
    }
    console.log(item.receivedFromAvailable);
    item.receivedFromAvailable.forEach(complaint => {
     if (complaint.id !== null) {
        this.StockReceivedFromArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          active: new FormControl(complaint.active),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          branchName: new FormControl(complaint.branchName),
          receivedFrom: new FormControl(complaint.receivedFrom),
        })
      );
     }
    });
  }

    if (item.issuedToAvailable !== null && item.issuedToAvailable !== undefined) {
    this.availableStockForm.get('issuedToAvailable').reset();
    if (item.issuedToAvailable.length > 0) {
      item.issuedToAvailable.forEach(element => {
        this.StockIssuedToArray.removeAt(0);
      });
    }
    item.issuedToAvailable.forEach(complaint => {
     if (complaint.id !== null) {
        this.StockIssuedToArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          active: new FormControl(complaint.active),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          branchName: new FormControl(complaint.branchName),
          issuedTo: new FormControl(complaint.issuedTo),
        })
      );
     }
    });
  }
  }

  demandVsSupplyBgColor() {
    let value;
    if (this.stockAvailable !== null && this.stockAvailable !== undefined) {
    value = (this.availableStockForm.get('hospitals').value + this.availableStockForm.get('compatsIssues').value)
     / (this.availableStockForm.get('totalHospitalOrders').value +  this.availableStockForm.get('compatsOrders').value);
    // if (value !== undefined && value !== null) {
    if (value >= 0.5) { return 'green'; }
    if (value >= 0.25 && value < 0.5) { return 'orange'; }
    if (value >= 0 && value < 0.25) {  return 'red'; } else { return 'pink'; }
    // }
  }
}

demandVsSupplyBgPercentageColor(): string {
  let value;
  // if (this.stockAvailable !== null && this.stockAvailable !== undefined) {
  value = (this.availableStockForm.get('hospitals').value)
   / (this.availableStockForm.get('totalHospitalOrders').value);
  // if (value !== undefined && value !== null) {
  if (value >= 0.5) { return 'green'; }
  if (value >= 0.25 && value < 0.5) { return 'orange'; }
  if (value >= 0 && value < 0.25) {  return 'red'; } else { return 'pink'; }
  // }
// }
}
demandVsSupplyBgPercentage(): number {
  if (this.availableStockForm.get('hospitals').value !== null && this.availableStockForm.get('totalHospitalOrders').value !== null) {
    this.demandVsSupplyBgPercentageColor();
    return (Number(this.availableStockForm.get('hospitals').value
   / this.availableStockForm.get('totalHospitalOrders').value) * 100); } else {
     return 0;
   }
}

getByDate(value) {
  console.log(value);
  value.todaysDate = this.availableStockForm.get('todaysDate').value;
  this.availableStockService.getAvailableStockByDate(value).subscribe(
  result => {
    console.log(result);
    this.stockAvailable = result;
    if (this.stockAvailable !== null) {
      this.editForm = result.active;
      this.populateForm(this.stockAvailable);
    }
    if (this.stockAvailable === null) {
      this.populateNewForm();
    }
  }
);

}

  getAllBranches() {
    this.branchService.getAll().subscribe(
      result => {
        this.AllBranches = result;
      },
       error => {
         console.log(error.error);
       },
       () => {
        const toSelect = this.AllBranches.find(c => c.id === this.branchId);
        this.availableStockForm.get('branch').setValue(toSelect);
       }
      //  this.getInitvalues();
    );
  }

  loadBranches(id) {
    this.branchService.getAllForUser(id).subscribe(
      result => {
       this.branches = result;
      },
      error => {
        console.log(error.error);
      },
      () => {
        this.loadStockReceivedFrom();
        this.loadStockIssuedTo();
      }
    );
  }

  reloadForBranch(branchId) {
    this.branchService.getAllForUser(branchId).subscribe(
      result => {
       this.branches = result;
       console.log(this.branches);
       this.getInitvalues(branchId);
      },
      error => {
        console.log(error.error);
      },
    );
   }

  getInitvalues(branchId) {
    this.availableStockService.getAvailableStock(branchId).subscribe(
     result => {
      this.stockAvailable = result;
      if (this.stockAvailable !== null) {
        this.editForm = result.active;
        this.populateForm(this.stockAvailable);
      }
      if (this.stockAvailable === null) {
        this.showEditBtn = false; // console.log(result.message);
        this.editForm = true;

        this.populateNewForm();
      }
     },
     error => {
        console.log(error.error);
     },
    );
  }

  saveStockAvailable(value) {
if (!this.compareAvailableTotals()) {
    this.showEditBtn = false;
    this.availableStockService.save(value).subscribe(
      result => {
        this.stockAvailable = result.stockAvailable;
        console.log(this.stockAvailable);
        // console.log(result.message);
        if (this.stockAvailable !== null) {
          this.editForm = result.active;
        }
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
        this.populateForm(result.stockAvailable);
      },
      error => {
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
        // console.log(error.error);
      },
      () => {
      }
    );
  } else {
     this.snotify.error('Please check available stock entries', 'Error', this.util.getNotifyConfig());
  }
  }

  submitStockAvailable(value) {
if (!this.compareAvailableTotals()) {

    this.availableStockService.submit(value).subscribe(
      result => {
        console.log(result.stockAvailable);
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
        this.editForm = result.stockAvailable.active;
        this.showEditBtn = true; // console.log(result.message);
        this.populateForm(result.stockAvailable);
    },
      error => {
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
        // console.log(error.error);
      },
      () => {
      //  this.populateNewForm();
      }
    );
     } else {
     this.snotify.error('Please check available stock entries', 'Error', this.util.getNotifyConfig());
  }
  }

  initStockReceivedFrom(ds?) {
    return this.fb.group({
      id: new FormControl(),
      version: new FormControl(),
      active: new FormControl(),
      createdById: new FormControl(),
      dateCreated: new FormControl(),
    branchName: new FormControl(ds.branchName),
    receivedFrom: new FormControl(),
    });
  }
  get StockReceivedFromArray() {
    return this.availableStockForm.get('receivedFromAvailable') as FormArray;
  }
  loadStockReceivedFrom() {
    this.branches.forEach(ds => {
      this.StockReceivedFromArray.push(this.initStockReceivedFrom(ds));
    });
 }

 initStockIssuedTo(ds?) {
  return this.fb.group({
    id: new FormControl(),
    version: new FormControl(),
    active: new FormControl(),
    createdById: new FormControl(),
    dateCreated: new FormControl(),
    branchName: new FormControl(ds.branchName),
    issuedTo: new FormControl(),
  });
}
get StockIssuedToArray() {
  return this.availableStockForm.get('issuedToAvailable') as FormArray;
}
loadStockIssuedTo() {
  this.branches.forEach(ds => {
    this.StockIssuedToArray.push(this.initStockIssuedTo(ds));
  });
}
// ***************calculations*****************
  sumReceived(value?) {
    let total = 0;
    total = Number(value.openingStock) + Number(value.receivedFromQuarantine);
    value.receivedFromAvailable.forEach(item => {
    total += Number(item.receivedFrom);
    });
    this.availableStockForm.get('totalAvailable').setValue(total);
    this.availableStockForm.get('currentAvailableStock').setValue(
      this.availableStockForm.get('totalAvailable').value - this.availableStockForm.get('totalIssues').value);
    this.cardStockAvailable =  total - value.totalIssues;

  }
  sumReceivedOnly(value?) {
    let total = 0;
    // total = Number(value.openingStock) + Number(value.receivedFromQuarantine);
    value.receivedFromAvailable.forEach(item => {
    total += Number(item.receivedFrom);
    });
    this.availableStockForm.get('totalReceipts').setValue(total);
    this.availableStockForm.get('currentAvailableStock').setValue(
      this.availableStockForm.get('totalAvailable').value - this.availableStockForm.get('totalIssues').value);
    this.cardStockAvailable =  total - value.totalIssues;

  }

  sumIssued(value) {
    let total = 0;
    value.issuedToAvailable.forEach(item => {
      total += Number(item.issuedTo);
    });
    this.availableStockForm.get('totalTransfersToOtherBranches').setValue(total);
    total += Number(value.hospitals) + Number(value.receicedFromQuarantine) + Number(value.issueToCompats)
     + Number(value.expired) + Number(value.disasters) + Number(value.haemolysed_clots_other) + Number(value.wholeBloodToPackedCells);
    this.availableStockForm.get('totalIssues').setValue(total);
    this.availableStockForm.get('currentAvailableStock').setValue(
      this.availableStockForm.get('totalAvailable').value - this.availableStockForm.get('totalIssues').value);
    this.cardStockAvailable =  value.totalAvailable - total;
  }

  demandVsSupply(value): number {
    if (this.overallOrders() === null && this.overallOrders() === undefined && this.overallOrders() === 0 ) {
      return 0;
    } else {
      return (Math.round((this.overallSupplies()  / this.overallOrders()) * 100));
    }
  }

  overallSupplies(): number {
    const value = this.availableStockForm.get('hospitals').value + this.availableStockForm.get('compatsIssues').value;
    this.availableStockForm.get('overallSupplies').setValue(value);
    return value;
  }

  overallOrders(): number {
    // let total = 0;
    const value = this.availableStockForm.get('totalHospitalOrders').value +  this.availableStockForm.get('compatsOrders').value;
    //  value.totalHospitalOrders + value.compatsOrders;
    this.availableStockForm.get('overallOrders').setValue(value);
    if (this.availableStockForm.get('overallSupplies').value) {
        this.availableStockForm.get('overallDemandVsSupply').setValue(
      ((this.availableStockForm.get('overallSupplies').value / value) * 100).toFixed(0)
    );
    }
    return value;
  }

  calcStockAvailable(): number {
    return this.availableStockForm.get('totalTotalcompatibility').value + this.availableStockForm.get('totalTotal').value;
  }

  // ****TABLE****
  sumRhPositiveWb(value) {
    let total = 0;
    total = Number(value.rhPositiveWbO) + Number(value.rhPositiveWbA) +
     Number(value.rhPositiveWbB) + Number(value.rhPositiveWbAB);
    this.availableStockForm.get('totalRhPositiveWb').setValue(total);
    this.availableStockForm.get('grandTotalWbPositive').setValue(
      this.availableStockForm.get('totalRhPositiveWbcompatibility').value +
      this.availableStockForm.get('totalRhPositiveWb').value
    );
  }
  sumRhPositivePc(value) {
    let total = 0;
    total = Number(value.rhPositivePcO) + Number(value.rhPositivePcA) +
     Number(value.rhPositivePcB) + Number(value.rhPositivePcAB);
    this.availableStockForm.get('totalRhPositivePc').setValue(total);
    this.availableStockForm.get('grandTotalPcPositive').setValue(
      this.availableStockForm.get('totalRhPositivePccompatibility').value +
      this.availableStockForm.get('totalRhPositivePc').value
    );
  }
  sumRhPositivePaedWb(value) {
    let total = 0;
    total = Number(value.rhPositivePaedWbO) + Number(value.rhPositivePaedWbA) +
     Number(value.rhPositivePaedWbB) + Number(value.rhPositivePaedWbAB);
    this.availableStockForm.get('totalRhPositivePaedWb').setValue(total);
    this.availableStockForm.get('grandTotalPaedWbPositive').setValue(
      this.availableStockForm.get('totalRhPositivePaedWbcompatibility').value +
      this.availableStockForm.get('totalRhPositivePaedWb').value
    );
  }
  sumRhPositivePaedPc(value) {
    let total = 0;
    total = Number(value.rhPositivePaedPcO) + Number(value.rhPositivePaedPcA) +
     Number(value.rhPositivePaedPcB) + Number(value.rhPositivePaedPcAB);
    this.availableStockForm.get('totalRhPositivePaedPc').setValue(total);
    this.availableStockForm.get('grandTotalPaedPcPositive').setValue(
      this.availableStockForm.get('totalRhPositivePaedPccompatibility').value +
      this.availableStockForm.get('totalRhPositivePaedPc').value
    );
  }

  sumRhNegativeWb(value) {
    let total = 0;
    total = Number(value.rhNegativeWbO) + Number(value.rhNegativeWbA) +
     Number(value.rhNegativeWbB) + Number(value.rhNegativeWbAB);
    this.availableStockForm.get('totalRhNegativeWb').setValue(total);
    this.availableStockForm.get('grandTotalWbNegative').setValue(
      this.availableStockForm.get('totalRhNegativeWbcompatibility').value +
      this.availableStockForm.get('totalRhNegativeWb').value
    );
  }
  sumRhNegativePc(value) {
    let total = 0;
    total = Number(value.rhNegativePcO) + Number(value.rhNegativePcA) +
     Number(value.rhNegativePcB) + Number(value.rhNegativePcAB);
    this.availableStockForm.get('totalRhNegativePc').setValue(total);
    this.availableStockForm.get('grandTotalPcNegative').setValue(
      this.availableStockForm.get('totalRhNegativePccompatibility').value +
      this.availableStockForm.get('totalRhNegativePc').value
    );
  }
  sumRhNegativePaedWb(value) {
    let total = 0;
    total = Number(value.rhNegativePaedWbO) + Number(value.rhNegativePaedWbA) +
     Number(value.rhNegativePaedWbB) + Number(value.rhNegativePaedWbAB);
    this.availableStockForm.get('totalRhNegativePaedWb').setValue(total);
    this.availableStockForm.get('grandTotalPaedWbNegative').setValue(
      this.availableStockForm.get('totalRhNegativePaedWbcompatibility').value +
      this.availableStockForm.get('totalRhNegativePaedWb').value
    );
  }
  sumRhNegativePaedPc(value) {
    let total = 0;
    total = Number(value.rhNegativePaedPcO) + Number(value.rhNegativePaedPcA) +
     Number(value.rhNegativePaedPcB) + Number(value.rhNegativePaedPcAB);
    this.availableStockForm.get('totalRhNegativePaedPc').setValue(total);
    this.availableStockForm.get('grandTotalPaedPcNegative').setValue(
      this.availableStockForm.get('totalRhNegativePaedPccompatibility').value +
      this.availableStockForm.get('totalRhNegativePaedPc').value
    );
  }
  totalVertical() {
    let total = 0;
    total = Number(this.availableStockForm.get('totalO').value)
    + Number(this.availableStockForm.get('totalA').value)
    + Number(this.availableStockForm.get('totalB').value)
    + Number(this.availableStockForm.get('totalAB').value);
    this.availableStockForm.get('totalTotal').setValue(total);

    this.calcStockAvailable();

    this.availableStockForm.get('grandTotal').setValue(
      this.availableStockForm.get('totalTotal').value + this.availableStockForm.get('totalTotalcompatibility').value
    );

    this.availableStockForm.get('percentagefTotalO').setValue(
      ( Math.round((this.availableStockForm.get('totalO').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalA').setValue(
      ( Math.round((this.availableStockForm.get('totalA').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalB').setValue(
      ( Math.round((this.availableStockForm.get('totalB').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalAB').setValue(
      ( Math.round((this.availableStockForm.get('totalAB').value / total) * 100)));

  }

  totalO(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbO) +
    Number(value.rhPositivePcO) +
    Number(value.rhPositivePaedWbO) +
    Number(value.rhPositivePaedPcO) +
    Number(value.rhNegativeWbO) +
    Number(value.rhNegativePcO) +
    Number(value.rhNegativePaedWbO) +
    Number(value.rhNegativePaedPcO);
    this.availableStockForm.get('totalO').setValue(total);
    this.totalVertical();
  }
  totalA(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbA) +
    Number(value.rhPositivePcA) +
    Number(value.rhPositivePaedWbA) +
    Number(value.rhPositivePaedPcA) +
    Number(value.rhNegativeWbA) +
    Number(value.rhNegativePcA) +
    Number(value.rhNegativePaedWbA) +
    Number(value.rhNegativePaedPcA);
    this.availableStockForm.get('totalA').setValue(total);
    this.totalVertical();
  }
  totalB(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbB) +
    Number(value.rhPositivePcB) +
    Number(value.rhPositivePaedWbB) +
    Number(value.rhPositivePaedPcB) +
    Number(value.rhNegativeWbB) +
    Number(value.rhNegativePcB) +
    Number(value.rhNegativePaedWbB) +
    Number(value.rhNegativePaedPcB);
    this.availableStockForm.get('totalB').setValue(total);
    this.totalVertical();
  }
  totalAB(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbAB) +
    Number(value.rhPositivePcAB) +
    Number(value.rhPositivePaedWbAB) +
    Number(value.rhPositivePaedPcAB) +
    Number(value.rhNegativeWbAB) +
    Number(value.rhNegativePcAB) +
    Number(value.rhNegativePaedWbAB) +
    Number(value.rhNegativePaedPcAB);
    this.availableStockForm.get('totalAB').setValue(total);
    this.totalVertical();
  }
  totalHorizontal(value) {
    let total = 0;
    total =
    Number(value.totalRhPositiveWb) +
    Number(value.totalRhPositivePc) +
    Number(value.totalRhPositivePaedWb) +
    Number(value.totalRhPositivePaedPc) +
    Number(value.totalRhNegativeWb) +
    Number(value.totalRhNegativePc) +
    Number(value.totalRhNegativePaedWb) +
    Number(value.totalRhNegativePaedPc);
    this.availableStockForm.get('totalTotal').setValue(total);
  }

  comSumRhPositiveWb(value) {
    let total = 0;
    total = Number(value.rhPositiveWbOcompatibility) + Number(value.rhPositiveWbAcompatibility) +
     Number(value.rhPositiveWbBcompatibility) + Number(value.rhPositiveWbABcompatibility);
    this.availableStockForm.get('totalRhPositiveWbcompatibility').setValue(total);
    this.availableStockForm.get('grandTotalWbPositive').setValue(
      this.availableStockForm.get('totalRhPositiveWbcompatibility').value +
      this.availableStockForm.get('totalRhPositiveWb').value
    );
  }
  comSumRhPositivePc(value) {
    let total = 0;
    total = Number(value.rhPositivePcOcompatibility) + Number(value.rhPositivePcAcompatibility) +
     Number(value.rhPositivePcBcompatibility) + Number(value.rhPositivePcABcompatibility);
    this.availableStockForm.get('totalRhPositivePccompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPcPositive').setValue(
      this.availableStockForm.get('totalRhPositivePccompatibility').value +
      this.availableStockForm.get('totalRhPositivePc').value
    );
  }
  comSumRhPositivePaedWb(value) {
    let total = 0;
    total = Number(value.rhPositivePaedWbOcompatibility) + Number(value.rhPositivePaedWbAcompatibility) +
     Number(value.rhPositivePaedWbBcompatibility) + Number(value.rhPositivePaedWbABcompatibility);
    this.availableStockForm.get('totalRhPositivePaedWbcompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPaedWbPositive').setValue(
      this.availableStockForm.get('totalRhPositivePaedWbcompatibility').value +
      this.availableStockForm.get('totalRhPositivePaedWb').value
    );
  }
  comSumRhPositivePaedPc(value) {
    let total = 0;
    total = Number(value.rhPositivePaedPcOcompatibility) + Number(value.rhPositivePaedPcAcompatibility) +
     Number(value.rhPositivePaedPcBcompatibility) + Number(value.rhPositivePaedPcABcompatibility);
    this.availableStockForm.get('totalRhPositivePaedPccompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPaedPcPositive').setValue(
      this.availableStockForm.get('totalRhPositivePaedPccompatibility').value +
      this.availableStockForm.get('totalRhPositivePaedPc').value
    );
  }

  comSumRhNegativeWb(value) {
    let total = 0;
    total = Number(value.rhNegativeWbOcompatibility) + Number(value.rhNegativeWbAcompatibility) +
     Number(value.rhNegativeWbBcompatibility) + Number(value.rhNegativeWbABcompatibility);
    this.availableStockForm.get('totalRhNegativeWbcompatibility').setValue(total);
    this.availableStockForm.get('grandTotalWbNegative').setValue(
      this.availableStockForm.get('totalRhNegativeWbcompatibility').value +
      this.availableStockForm.get('totalRhNegativeWb').value
    );
  }
  comSumRhNegativePc(value) {
    let total = 0;
    total = Number(value.rhNegativePcOcompatibility) + Number(value.rhNegativePcAcompatibility) +
     Number(value.rhNegativePcBcompatibility) + Number(value.rhNegativePcABcompatibility);
    this.availableStockForm.get('totalRhNegativePccompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPcNegative').setValue(
      this.availableStockForm.get('totalRhNegativePccompatibility').value +
      this.availableStockForm.get('totalRhNegativePc').value
    );
  }
  comSumRhNegativePaedWb(value) {
    let total = 0;
    total = Number(value.rhNegativePaedWbOcompatibility) + Number(value.rhNegativePaedWbAcompatibility) +
     Number(value.rhNegativePaedWbBcompatibility) + Number(value.rhNegativePaedWbABcompatibility);
    this.availableStockForm.get('totalRhNegativePaedWbcompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPaedWbNegative').setValue(
      this.availableStockForm.get('totalRhNegativePaedWbcompatibility').value +
      this.availableStockForm.get('totalRhNegativePaedWb').value
    );
  }
  comSumRhNegativePaedPc(value) {
    let total = 0;
    total = Number(value.rhNegativePaedPcOcompatibility) + Number(value.rhNegativePaedPcAcompatibility) +
     Number(value.rhNegativePaedPcBcompatibility) + Number(value.rhNegativePaedPcABcompatibility);
    this.availableStockForm.get('totalRhNegativePaedPccompatibility').setValue(total);
    this.availableStockForm.get('grandTotalPaedPcNegative').setValue(
      this.availableStockForm.get('totalRhNegativePaedPccompatibility').value +
      this.availableStockForm.get('totalRhNegativePaedPc').value
    );
  }
  comTotalVertical() {
    let total = 0;
    total = Number(this.availableStockForm.get('totalOcompatibility').value)
    + Number(this.availableStockForm.get('totalAcompatibility').value)
    + Number(this.availableStockForm.get('totalBcompatibility').value)
    + Number(this.availableStockForm.get('totalABcompatibility').value);
    this.availableStockForm.get('totalTotalcompatibility').setValue(total);
    this.calcStockAvailable();

    this.availableStockForm.get('grandTotal').setValue(
      this.availableStockForm.get('totalTotal').value + this.availableStockForm.get('totalTotalcompatibility').value
    );

    this.availableStockForm.get('percentageOfTotalOcompatibility').setValue(
      ( Math.round((this.availableStockForm.get('totalOcompatibility').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalAcompatibility').setValue(
      ( Math.round((this.availableStockForm.get('totalAcompatibility').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalBcompatibility').setValue(
      ( Math.round((this.availableStockForm.get('totalBcompatibility').value / total) * 100)));
    this.availableStockForm.get('percentageOfTotalABcompatibility').setValue(
      ( Math.round((this.availableStockForm.get('totalABcompatibility').value / total) * 100)));
  }

  comTotalO(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbOcompatibility) +
    Number(value.rhPositivePcOcompatibility) +
    Number(value.rhPositivePaedWbOcompatibility) +
    Number(value.rhPositivePaedPcOcompatibility) +
    Number(value.rhNegativeWbOcompatibility) +
    Number(value.rhNegativePcOcompatibility) +
    Number(value.rhNegativePaedWbOcompatibility) +
    Number(value.rhNegativePaedPcOcompatibility);
    this.availableStockForm.get('totalOcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalA(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbAcompatibility) +
    Number(value.rhPositivePcAcompatibility) +
    Number(value.rhPositivePaedWbAcompatibility) +
    Number(value.rhPositivePaedPcAcompatibility) +
    Number(value.rhNegativeWbAcompatibility) +
    Number(value.rhNegativePcAcompatibility) +
    Number(value.rhNegativePaedWbAcompatibility) +
    Number(value.rhNegativePaedPcAcompatibility);
    this.availableStockForm.get('totalAcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalB(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbBcompatibility) +
    Number(value.rhPositivePcBcompatibility) +
    Number(value.rhPositivePaedWbBcompatibility) +
    Number(value.rhPositivePaedPcBcompatibility) +
    Number(value.rhNegativeWbBcompatibility) +
    Number(value.rhNegativePcBcompatibility) +
    Number(value.rhNegativePaedWbBcompatibility) +
    Number(value.rhNegativePaedPcBcompatibility);
    this.availableStockForm.get('totalBcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalAB(value) {
    let total = 0;
    total =
    Number(value.rhPositiveWbABcompatibility) +
    Number(value.rhPositivePcABcompatibility) +
    Number(value.rhPositivePaedWbABcompatibility) +
    Number(value.rhPositivePaedPcABcompatibility) +
    Number(value.rhNegativeWbABcompatibility) +
    Number(value.rhNegativePcABcompatibility) +
    Number(value.rhNegativePaedWbABcompatibility) +
    Number(value.rhNegativePaedPcABcompatibility);
    this.availableStockForm.get('totalABcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalHorizontal(value) {
    let total = 0;
    total =
    Number(value.totalRhPositiveWbcompatibility) +
    Number(value.totalRhPositivePccompatibility) +
    Number(value.totalRhPositivePaedWbcompatibility) +
    Number(value.totalRhPositivePaedPccompatibility) +
    Number(value.totalRhNegativeWbcompatibility) +
    Number(value.totalRhNegativePccompatibility) +
    Number(value.totalRhNegativePaedWbcompatibility) +
    Number(value.totalRhNegativePaedPccompatibility);
    this.availableStockForm.get('totalTotalcompatibility').setValue(total);
  }
  sumCompats(value) {
    let total = 0;
    total = (Math.floor((value.compatsIssues / value.compatsOrders) * 100));
    this.availableStockForm.get('compatsPercentageSupply_Orders').setValue(total);
  }





compareByValue(f1: any, f2: any) {
  return f1 && f2 && f1.id === f2.id;
}



}
