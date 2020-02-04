import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { QuarantinedStockService } from '../../shared/config/service/quarantined-stock.service';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { StockQuarantined } from 'src/app/shared/config/model/Stock-quarantined.model';
import { BranchService } from 'src/app/shared/config/service/admin/branch.service';
import { error } from '@angular/compiler/src/util';
import { DataManagementService } from '../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { StorageKey } from 'src/app/util/key';
import { Snotify, SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';
import { isNumber } from 'util';
import { User } from '../../shared/config/model/admin/user.model';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';

@Component({
  selector: 'app-stock-quarantined',
  templateUrl: './stock-quarantined.component.html',
  styleUrls: ['./stock-quarantined.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // this line
})
export class StockQuarantinedComponent implements OnInit {

  panelOpenState = false;
  quarantinedStockForm: FormGroup;
  branchGroup: FormGroup;
  branches: Branch[];
  userBranch: Branch;
  branchesSize: number;
  stockQuarantined: StockQuarantined = new StockQuarantined();
  // branch: object;
  harareCbd = 0;
  harareCbdNaChecked : boolean;
  staticHq = 0;
  staticHqNaChecked : boolean;
  mobile02 = 0;
  mobile02NaChecked : boolean;
  mobile04 = 0;
  mobile04NaChecked : boolean;
  mobile06 = 0;
  mobile06NaChecked : boolean;
  allBranches: Branch[];
  selected: Branch;
  branchId: number;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  initOpeningStock = 0;
  initTotalReceipts = 0;
  initTotalIssues = 0;
  initTotalDiscards = 0;
  initCollections = 0;
  collectionsIndicator = 0;
  initCollectionsFromDb = 0;
  branchTotalMinCapacity: BranchDailyMinimalCapacity = new BranchDailyMinimalCapacity();
  editBranches = false;
  roles: string[];
  util;
  yesterdayDate: any;
  editForm = true;
  showEditBtn = false;
  showSaveBtn = true;
  showSubmitBtn = true;
  user: string;
  currentUser: any;
  totolCollectionsFromTeams = 0;

  constructor(private branchService: BranchService, private dataManService: DataManagementService, private dashService: DashboardService,
              private qStockService: QuarantinedStockService, private availableStockService: AvailableStockService,
               private fb: FormBuilder, private snotify: SnotifyService) { }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    // this.getUserBranch(this.branchId);
    this.setYesterdayDate();
    this.createForms();
    this.loadBranches(this.branchId);
    this.getAllBranches();
    this.getCurrentUser();
    this.getBranchTotalMinCapacity();
    if (this.quarantinedStockForm.get('branch').value !== null && this.quarantinedStockForm.get('branch').value !== '') {
      this.getInitvalues(this.branchId);
    } else {
      this.editForm = false;
    }
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    if (!this.roles.includes('ROLE_ADMIN')) {
      this.editBranches = true; } else {
        this.editBranches = false;
      }
    this.user = localStorage.getItem('USER');

    this.util = new NotifyUtil(this.snotify);
  }


  setYesterdayDate() {
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    this.yesterdayDate = yDate;
  }
  getCurrentUser() {
    this.branchService.getCurrentUsername().subscribe(
      result => {
        this.currentUser = result;
      }
    );
  }
  collectionsBgColor() {

    this.collectionsIndicator = ((this.initCollections) / this.initCollectionsFromDb);
    const value = this.collectionsIndicator;
    if (value !== undefined && value !== null) {
      if (value >= 1) { return 'purple'; }
      if (value >= 0.75 && value < 1) { return 'green'; }
      if (value >= 0.4 && value < 0.75) { return 'orange'; }
      if (value >= 0 && value < 0.4) { return 'red'; } else { return 'pink'; }
    }
  }
  colorIndicator(value): string {
    if (value !== undefined && value !== null) {
    if (value >= 1) { return 'purple'; }
    if (value >= 0.75 && value < 1) { return 'green'; }
    if (value >= 0.40 && value < 0.75) { return 'orange'; }
    if (value >= 0 && value < 0.4) { return 'red'; } else { return 'pink'; }
    }
  }

  staticHqColor(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('staticFacility').value / this.userBranch.minStatic);
    }
  harareCbdColor(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('cbd').value / this.userBranch.minCbd);
    }
    mobile02Color(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('mobile02').value / this.userBranch.minMob1);
    }
    mobile04Color(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('mobile04').value / this.userBranch.minMob2);
    }
    mobile06Color(): string {
      return this.colorIndicator(this.quarantinedStockForm.get('mobile06').value / this.userBranch.minMob3);
      }

  getUserBranch(branchId): Branch {
    this.branchService.getItem(this.branchId).subscribe(
      result => {
        this.selected = result;
        console.log(this.selected);
      },
      error => {
        console.log(error.error);
      },
      () => {
    this.quarantinedStockForm.get('branch.branchName').setValue(this.selected.branchName);
    this.getInitvalues(this.selected.id);
      }
    );
    return this.selected;
  }


  createForms() {
    this.quarantinedStockForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      // branch: this.createBranch(),
      branch: new FormControl(
        '', [
          Validators.required,
        ]
        // {disabled: this.editBranches}
      ),
      todaysDate: new FormControl(this.yesterdayDate),
      openingStock: new FormControl(),
      cbd: new FormControl(),
      staticFacility: new FormControl(),
      mobile04: new FormControl(),
      mobile02: new FormControl(),
      mobile06: new FormControl(),
      totalCollections: new FormControl(),
      referenceLaboratory: new FormControl(),
      totalReceiptsFromBranches: new FormControl(),
      totalReceiptsFromBranchesOnly: new FormControl(),
      p1: new FormControl(),
      dryPacksD3D4: new FormControl(),
      p2: new FormControl(),
      dryPacksD1: new FormControl(),
      p3: new FormControl(),
      samplesOnly: new FormControl(),
      c11: new FormControl(),
      expired: new FormControl(),
      wrongPack: new FormControl(),
      broken: new FormControl(),
      other: new FormControl(),
      serologicalDiscards: new FormControl(),
      totalIssuesDiscards: new FormControl(),
      availableStock: new FormControl(),
      totalBloodTransferredToOtherBranches: new FormControl(),
      issueTogroupMismatchesToRefLab: new FormControl(),
      totalIssues: new FormControl(),
      currentStockInQuarantine: new FormControl(),
      ffp1: new FormControl(),
      plt1: new FormControl(),
      plt2: new FormControl(),
      cryo: new FormControl(),
      compiledBy: new FormControl(),
      checkedBy: new FormControl(),
      receivedFromQuarantineds: this.fb.array([
        // this.initStockReceivedFrom()
      ]),
      issuedToQuarantines: this.fb.array([
        // this.initStockIssuedTo()
      ])
    });
  }

  createBranch(): FormGroup {
    this.branchGroup = new FormGroup({
      id: new FormControl(),
      dateCreated: new FormControl(),
      uuid: new FormControl(),
      dateModified: new FormControl(),
      active: new FormControl(),
      deleted: new FormControl(),
      createdByName: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branchName: new FormControl(),
      address: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      officePhone: new FormControl(),
    });
    return this.branchGroup;
  }

  getBranchTotalMinCapacity() {
    this.dataManService.getBranchDailyMinimalCapacity().subscribe(
      result => {
        this.branchTotalMinCapacity = result;
        if (this.branchTotalMinCapacity !== null && this.branchTotalMinCapacity !== undefined) {
          // this.calculateCollections();
        }
      },
      error => {
        console.log(error.error);
     },
     () => {
     }
    );
  }
  calculateCollections() {
    if (this.branchTotalMinCapacity !== null ) {
    if (this.stockQuarantined.branch.branchName === 'HARARE') {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.harareTotalMinCapacity;
    }
    if (this.stockQuarantined.branch.branchName === 'BULAWAYO') {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.bulawayoTotalMinCapacity;
    }
    if (this.stockQuarantined.branch.branchName === 'GWERU') {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.gweruTotalMinCapacity;
    }
    if (this.stockQuarantined.branch.branchName === 'MUTARE') {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.mutareTotalMinCapacity;
    }
    if (this.stockQuarantined.branch.branchName === 'MASVINGO') {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.masvingoTotalMinCapacity;
    }
  }
  }

  calculateCollectionsPercentage(): number {
    // if (this.initCollectionsFromDb !== 0) {
    return this.initCollectionsFromDb !== 0 ? this.quarantinedStockForm.get('totalCollections').value / this.initCollectionsFromDb : 0;
    // } else { return 0; }
  }
  OpeningStock(value): number {
    return value.openingStock;
  }

  staticPercentage() {
    this.harareCbd = Math.round((this.quarantinedStockForm.get('cbd').value / this.userBranch.minCbd) * 100);
    this.staticHq = Math.round((this.quarantinedStockForm.get('staticFacility').value / this.userBranch.minStatic) * 100);
  }
  mobPercentage() {
    this.mobile02 = Math.round((this.quarantinedStockForm.get('mobile02').value / this.userBranch.minMob1) * 100);
    this.mobile04 = Math.round((this.quarantinedStockForm.get('mobile04').value / this.userBranch.minMob2) * 100);
    this.mobile06 = Math.round((this.quarantinedStockForm.get('mobile06').value / this.userBranch.minMob3) * 100);
    }

  QuarantineStock(): number {
   const value =
    // this.quarantinedStockForm.get('openingStock').value
    //   + this.quarantinedStockForm.get('totalCollections').value
      // - this.quarantinedStockForm.get('availableStock').value
      + this.quarantinedStockForm.get('totalReceiptsFromBranches').value
      - this.quarantinedStockForm.get('totalIssuesDiscards').value
      - this.quarantinedStockForm.get('totalIssues').value;

   this.quarantinedStockForm.get('currentStockInQuarantine').setValue(value);
   return value;
  }

  sumCollections(): number {
    let total = 0;
    if (this.quarantinedStockForm.get('cbd').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('cbd').value);
    }
    if (this.quarantinedStockForm.get('mobile02').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile02').value);
    }
    if (this.quarantinedStockForm.get('mobile04').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile04').value);
    }
    if (this.quarantinedStockForm.get('staticFacility').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('staticFacility').value);
    }
    if (this.quarantinedStockForm.get('mobile06').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile06').value);
    }
    this.quarantinedStockForm.get('totalCollections').setValue(total);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(
      total + Number(this.quarantinedStockForm.get('openingStock').value)
       + Number(this.quarantinedStockForm.get('referenceLaboratory').value));
    //    console.log(this.userBranch);
    // this.totolCollectionsFromTeams = total / ( Number(this.userBranch.minStatic) +  Number(this.userBranch.minCbd)
    //  +  Number(this.userBranch.minMob1) +  Number(this.userBranch.minMob2) +  Number(this.userBranch.minMob3));
    return total;
  }
  // totolCollectionsOnly(): number {
  //   return Number(this.quarantinedStockForm.get('totalCollections').value)
  //   + Number(this.quarantinedStockForm.get('openingStock').value);
  // }

  totolCollectionsOnly(): number {
    if (this.userBranch!== null && this.userBranch !== undefined) {
      return this.sumCollections() / ( Number(this.userBranch.minStatic) +  Number(this.userBranch.minCbd)
      +  Number(this.userBranch.minMob1) +  Number(this.userBranch.minMob2) +  Number(this.userBranch.minMob3));
    } else { return 0; }
  }

  initCollectionsValue(): number {
    this.initTotalReceipts =  Number(this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').value) +
      Number(this.quarantinedStockForm.get('totalCollections').value);
    return this.quarantinedStockForm.get('totalIssues').value
    + this.quarantinedStockForm.get('availableStock').value;
  }

  sumIssues(value): number {
    let total = 0;
    value.issuedToQuarantines.forEach(item => {
      total += Number(item.issuedTo);
    });
    total += Number(value.issueTogroupMismatchesToRefLab) + Number(value.availableStock);
    // this.quarantinedStockForm.get('totalBloodTransferredToOtherBranches').setValue(total);
    this.quarantinedStockForm.get('totalIssues').setValue(total);
    // this.initCollections = total + Number(value.availableStock);
    return total;
  }

  sumDiscards(value): number {
    let total = 0;
    total =  Number(value.p1) + Number(value.dryPacksD3D4) + Number(value.p2) +
    Number(value.dryPacksD1) + Number(value.p3) + Number(value.samplesOnly) + Number(value.c11) + Number(value.expired)
    + Number(value.wrongPack) + Number(value.broken) + Number(value.other) +  Number(value.serologicalDiscards);
    this.quarantinedStockForm.get('totalIssuesDiscards').setValue(total);
    return total;
  }

  sumReceived(value): number {
    let total = 0;
    value.receivedFromQuarantineds.forEach(item => {
      total += Number(item.receivedFrom);
    });
    // total = Number(this.quarantinedStockForm.get('referenceLaboratory').value);
    // this.StockReceivedFromArray.controls.forEach((item, index) => {
    //   const valueTotal = Number(this.getStockReceivedFromControls()[index].value.receivedFrom);
    //   total += valueTotal;
    // });
    this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').setValue(total
      +  Number(this.quarantinedStockForm.get('referenceLaboratory').value));
    this.initTotalReceipts = total + Number(this.quarantinedStockForm.get('referenceLaboratory').value) +
      Number(this.quarantinedStockForm.get('totalCollections').value);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(
      // Number(total) + Number(this.quarantinedStockForm.get('referenceLaboratory').value)
      + Number(this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').value)
      + Number(this.quarantinedStockForm.get('openingStock').value)
      + Number(this.quarantinedStockForm.get('totalCollections').value));
    return total +  Number(this.quarantinedStockForm.get('referenceLaboratory').value);
  }

  saveAQuarantinedStock(value) {
    this.qStockService.save(value).subscribe(
      result => {
        this.stockQuarantined = result.stockQuarantined;
        if (this.stockQuarantined !== null) {
          if (this.stockQuarantined.compiledBy === this.currentUser.firstName + this.currentUser.lastName) {
            this.showSaveBtn = true;
        } else if (this.showEditBtn === true) {
          this.showEditBtn = false;
          this.showSaveBtn = true;
        } else {
          this.showSaveBtn = false;
        }
        }
        console.log(result.stockQuarantined);
        console.log(result.message);
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
        console.log(error.error);
      },
      () => {
      // this.editForm = this.stockQuarantined.active;
      this.populateForm(this.stockQuarantined);
      window.scroll(0, 0);

      }
    );
  }

  submitStockQuarantined(value) {

    this.qStockService.submit(value).subscribe(
      result => {
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
        this.populateForm(result.stockQuarantined);
        this.editForm = result.stockQuarantined.active;
        this.showEditBtn = true;
        console.log(result.stockQuarantined);
      },
      error => {
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
        console.log(error.error);
      },
      () => {
        window.scroll(0, 0);
        // this.availableStockService.submit()
        this.populateNewForm();
      }
    );
  }

  populateNewForm() {
    this.mobile02NaChecked = false;
    this.mobile06NaChecked = false;
    this.mobile04NaChecked = false;
    this.harareCbdNaChecked = false;
    this.staticHqNaChecked = false;
    this.quarantinedStockForm.get('id').setValue('');
    this.quarantinedStockForm.get('dateCreated').setValue('');
    this.quarantinedStockForm.get('version').setValue('');
    this.quarantinedStockForm.get('createdById').setValue('');
    this.quarantinedStockForm.get('issuedToQuarantines').reset();
    this.quarantinedStockForm.get('receivedFromQuarantineds').reset();
    this.quarantinedStockForm.get('openingStock').setValue('');
    this.quarantinedStockForm.get('cbd').setValue('');
    this.quarantinedStockForm.get('staticFacility').setValue('');
    this.quarantinedStockForm.get('mobile04').setValue('');
    this.quarantinedStockForm.get('mobile02').setValue('');
    this.quarantinedStockForm.get('mobile06').setValue('');
    this.quarantinedStockForm.get('totalCollections').setValue('');
    this.quarantinedStockForm.get('referenceLaboratory').setValue('');
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue('');
    this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').setValue('');
    this.quarantinedStockForm.get('p1').setValue('');
    this.quarantinedStockForm.get('dryPacksD3D4').setValue('');
    this.quarantinedStockForm.get('p2').setValue('');
    this.quarantinedStockForm.get('dryPacksD1').setValue('');
    this.quarantinedStockForm.get('p3').setValue('');
    this.quarantinedStockForm.get('samplesOnly').setValue('');
    this.quarantinedStockForm.get('c11').setValue('');
    this.quarantinedStockForm.get('expired').setValue('');
    this.quarantinedStockForm.get('wrongPack').setValue('');
    this.quarantinedStockForm.get('other').setValue('');
    this.quarantinedStockForm.get('serologicalDiscards').setValue('');
    this.quarantinedStockForm.get('totalIssuesDiscards').setValue('');
    this.quarantinedStockForm.get('availableStock').setValue('');
    this.quarantinedStockForm.get('currentStockInQuarantine').setValue('');
    this.quarantinedStockForm.get('totalBloodTransferredToOtherBranches').setValue('');
    this.quarantinedStockForm.get('issueTogroupMismatchesToRefLab').setValue('');
    this.quarantinedStockForm.get('totalIssues').setValue('');
    this.quarantinedStockForm.get('ffp1').setValue('');
    this.quarantinedStockForm.get('plt1').setValue('');
    this.quarantinedStockForm.get('plt2').setValue('');
    this.quarantinedStockForm.get('compiledBy').setValue('');
    this.quarantinedStockForm.get('checkedBy').setValue('');
    this.quarantinedStockForm.get('cryo').setValue('');
  }

  populateForm(item) {
    // console.log(item.branch);
    this.quarantinedStockForm.get('id').setValue(item.id);
    this.quarantinedStockForm.get('dateCreated').setValue(item.dateCreated);
    this.quarantinedStockForm.get('version').setValue(item.version);
    this.quarantinedStockForm.get('createdById').setValue(item.createdById);
    this.quarantinedStockForm.get('openingStock').setValue(item.openingStock);
    if (item.cbd === 'NA') {
      this.harareCbdNaChecked = true;
    } else {
      this.harareCbdNaChecked = false;
    }
    this.quarantinedStockForm.get('cbd').setValue(item.cbd);
    if (item.staticFacility === 'NA') {
      this.staticHqNaChecked = true;
    } else {
      this.staticHqNaChecked = false;
    }
    this.quarantinedStockForm.get('staticFacility').setValue(item.staticFacility);
    if (item.mobile04 === 'NA') {
      this.mobile04NaChecked = true;
    } else {
      this.mobile04NaChecked = false;
    }
    this.quarantinedStockForm.get('mobile04').setValue(item.mobile04);
    if (item.mobile02 === 'NA') {
      this.mobile02NaChecked = true;
    } else {
      this.mobile02NaChecked = false;
    }
    this.quarantinedStockForm.get('mobile02').setValue(item.mobile02);
    if (item.mobile06 === 'NA') {
      this.mobile06NaChecked = true;
    } else {
      this.mobile06NaChecked = false;
    }
    this.quarantinedStockForm.get('mobile06').setValue(item.mobile06);
    this.quarantinedStockForm.get('totalCollections').setValue(item.totalCollections);
    this.quarantinedStockForm.get('referenceLaboratory').setValue(item.referenceLaboratory);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(item.totalReceiptsFromBranches);
    this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').setValue(item.totalReceiptsFromBranchesOnly);
    this.quarantinedStockForm.get('p1').setValue(item.p1);
    this.quarantinedStockForm.get('dryPacksD3D4').setValue(item.dryPacksD3D4);
    this.quarantinedStockForm.get('p2').setValue(item.p2);
    this.quarantinedStockForm.get('dryPacksD1').setValue(item.dryPacksD1);
    this.quarantinedStockForm.get('p3').setValue(item.p3);
    this.quarantinedStockForm.get('samplesOnly').setValue(item.samplesOnly);
    this.quarantinedStockForm.get('c11').setValue(item.c11);
    this.quarantinedStockForm.get('expired').setValue(item.expired);
    this.quarantinedStockForm.get('wrongPack').setValue(item.wrongPack);
    this.quarantinedStockForm.get('other').setValue(item.other);
    this.quarantinedStockForm.get('serologicalDiscards').setValue(item.serologicalDiscards);
    this.quarantinedStockForm.get('totalIssuesDiscards').setValue(item.totalIssuesDiscards);
    this.quarantinedStockForm.get('availableStock').setValue(item.availableStock);
    this.quarantinedStockForm.get('currentStockInQuarantine').setValue(item.currentStockInQuarantine);
    this.quarantinedStockForm.get('totalBloodTransferredToOtherBranches').setValue(item.totalBloodTransferredToOtherBranches);
    this.quarantinedStockForm.get('issueTogroupMismatchesToRefLab').setValue(item.issueTogroupMismatchesToRefLab);
    this.quarantinedStockForm.get('totalIssues').setValue(item.totalIssues);
    this.quarantinedStockForm.get('ffp1').setValue(item.ffp1);
    this.quarantinedStockForm.get('plt1').setValue(item.plt1);
    this.quarantinedStockForm.get('plt2').setValue(item.plt2);
    this.quarantinedStockForm.get('cryo').setValue(item.cryo);
    this.quarantinedStockForm.get('compiledBy').setValue(item.compiledBy);
    this.quarantinedStockForm.get('checkedBy').setValue(item.compiledBy);

    if (item.receivedFromQuarantineds !== null && item.receivedFromQuarantineds !== undefined) {
    this.quarantinedStockForm.get('receivedFromQuarantineds').reset();
    if (item.receivedFromQuarantineds.length > 0) {
      item.receivedFromQuarantineds.forEach(element => {
        this.StockReceivedFromArray.removeAt(0);
      });
    }
// }
    console.log(item.receivedFromQuarantineds);
    item.receivedFromQuarantineds.forEach(complaint => {
     if (complaint.id !== null) {
        this.StockReceivedFromArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          receivedFrom: new FormControl(complaint.receivedFrom),
        })
      );
     }
    });
  }


    if (item.issuedToQuarantines !== null && item.issuedToQuarantines !== undefined) {
    this.quarantinedStockForm.get('issuedToQuarantines').reset();
    if (item.issuedToQuarantines.length > 0) {
      item.issuedToQuarantines.forEach(element => {
        this.StockIssuedToArray.removeAt(0);
      });
    }
    console.log(item.issuedToQuarantines);
    item.issuedToQuarantines.forEach(complaint => {
     if (complaint.id !== null) {
        this.StockIssuedToArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          issuedTo: new FormControl(complaint.issuedTo),
        })
      );
     }
    });
  }
  }
  initStockReceivedFrom() {
    return this.fb.group({
      id: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      dateCreated: new FormControl(),
      receivedFrom: new FormControl(),
      branchName: new FormControl(),
    });
  }
  get StockReceivedFromArray() {
    return this.quarantinedStockForm.get('receivedFromQuarantineds') as FormArray;
  }
  getStockReceivedFromControls() {
    return (this.quarantinedStockForm.get('receivedFromQuarantineds') as FormArray).controls;
  }
  loadStockReceivedFrom() {
    this.branches.forEach(ds => {
      this.StockReceivedFromArray.push(this.initStockReceivedFrom());
    });
 }


 initStockIssuedTo(ds?) {
  return this.fb.group({
    issuedTo: new FormControl(),
    id: new FormControl(),
    version: new FormControl(),
    createdById: new FormControl(),
    dateCreated: new FormControl(),
    branchNames: new FormControl(),
  });
}
get StockIssuedToArray() {
  return this.quarantinedStockForm.get('issuedToQuarantines') as FormArray;
}
loadStockIssuedTo() {
  this.branches.forEach(ds => {
    this.StockIssuedToArray.push(this.initStockIssuedTo(ds));
  });
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
 getAllBranches() {
  this.branchService.getAll().subscribe(
    result => {
     this.allBranches = result;
     this.allBranches.forEach(
       item =>{
         if (item.id === Number(localStorage.getItem('BRANCH_ID'))) {
            this.userBranch = item;
         }
       }
     );
    },
    error => {
      console.log(error.error);
    },
    () => {
      const toSelect = this.allBranches.find(c => c.id === this.branchId);
      // if (!this.roles.includes('ROLE_ADMIN')) {
        this.quarantinedStockForm.get('branch').setValue(toSelect);
      // }
      if (this.quarantinedStockForm.get('branch').value !== null && this.quarantinedStockForm.get('branch').value !== '') {
        this.getInitvalues(this.quarantinedStockForm.value);
    } else {
      this.editForm = false;
    }

    }
  );
}
getUserBranches() {
  this.branchService.getAll().subscribe(
    result => {
     this.allBranches = result;
     console.log(this.allBranches);
    },
    error => {
      console.log(error.error);
    }
  );
}
 getInitvalues(value) {
  this.showEditBtn = false;
  value.todaysDate = this.quarantinedStockForm.get('todaysDate').value;
  this.qStockService.getAvailableStockByDate(value).subscribe(
     result => {
      this.stockQuarantined = result;
      if (this.stockQuarantined !== null) {
        this.userBranch = this.stockQuarantined.branch;
        if (this.stockQuarantined.compiledBy === this.currentUser.firstName + this.currentUser.lastName) {
          this.showSaveBtn = true;
      } else if (this.stockQuarantined.checkedBy === null) {
          // this.showSubmitBtn = true;
          this.showSaveBtn = false;
        } else {
          this.showSaveBtn = false;
        }
        this.editForm = result.active;
        this.populateForm(this.stockQuarantined);
        this.calculateCollections(); // supposed to be in ther above loop
      }
      if (this.stockQuarantined === null) {


        this.showSaveBtn = true;
        this.showSubmitBtn = false;
        this.showEditBtn = false; // console.log(result.message);
        this.editForm = true;
        this.populateNewForm();
        if (this.quarantinedStockForm.get('branch').value.branchName === 'HARARE') {
            this.initCollectionsFromDb = this.branchTotalMinCapacity.harareTotalMinCapacity;
          }
        if (this.quarantinedStockForm.get('branch').value.branchName === 'BULAWAYO') {
            this.initCollectionsFromDb = this.branchTotalMinCapacity.bulawayoTotalMinCapacity;
          }
        if (this.quarantinedStockForm.get('branch').value.branchName === 'GWERU') {
            this.initCollectionsFromDb = this.branchTotalMinCapacity.gweruTotalMinCapacity;
          }
        if (this.quarantinedStockForm.get('branch').value.branchName === 'MUTARE') {
            this.initCollectionsFromDb = this.branchTotalMinCapacity.mutareTotalMinCapacity;
          }
        if (this.quarantinedStockForm.get('branch').value.branchName === 'MASVINGO') {
            this.initCollectionsFromDb = this.branchTotalMinCapacity.masvingoTotalMinCapacity;
          }
      }
    },
    error => {
       console.log(error.error);
    }, () => { }
   );
 }

 getByDate(value) {
    value.todaysDate = this.quarantinedStockForm.get('todaysDate').value;
    this.qStockService.getAvailableStockByDate(value).subscribe(
    result => {
      this.stockQuarantined = result;
      if (this.stockQuarantined !== null) {

        this.editForm = result.active;
        this.showSaveBtn = !result.active;
        this.populateForm(this.stockQuarantined);
        this.calculateCollections(); // supposed to be in ther above loop
      }
      if (this.stockQuarantined === null) {

        const currentDay = new Date();
        currentDay.setDate(currentDay.getDate() - 1);
        currentDay.setHours(0 , 0, 0 , 0);

      //   if ( value.todaysDate >= currentDay ) {
      //     this.editForm = true;
      //   } else {
      //     this.editForm = false;
      //  }

        this.populateNewForm();
        this.editForm = true;
        this.showSaveBtn = true;
      }
    }
  );

}

 reloadForBranch(branchId, value) {
  this.branchService.getAllForUser(branchId).subscribe(
    result => {
     this.branches = result;
     this.getInitvalues(value);
    },
    error => {
      console.log(error.error);
    },
    () => {
      this.branchService.getItem(branchId).subscribe(
        result => {
          this.userBranch = result;
        }
        );
          window.scroll(0, 0);

      }
      );
    }

 compareByValue(f1: any, f2: any) {
  return f1 && f2 && f1.id === f2.id;
}
staticHqNA(checked) {
    this.staticHqNaChecked = checked.checked;
    if (checked.checked) {
      this.quarantinedStockForm.get('staticFacility').setValue('NA');
      this.sumCollections();
    } else {
      this.quarantinedStockForm.get('staticFacility').setValue(0);
      this.sumCollections();
    }
}
cbd(checked) {
  this.harareCbdNaChecked = checked.checked;
  if (checked.checked) {
    this.quarantinedStockForm.get('cbd').setValue('NA');
    this.sumCollections();
  } else {
    this.quarantinedStockForm.get('cbd').setValue(0);
  }
}
mobile02_(checked) {
  this.mobile02NaChecked = checked.checked;
  if (checked.checked) {
    this.quarantinedStockForm.get('mobile02').setValue('NA');
    this.sumCollections();
  } else {
    this.quarantinedStockForm.get('mobile02').setValue(0);
  }
}
mobile04_(checked) {
  this.mobile04NaChecked = checked.checked;
  if (checked.checked) {
    this.quarantinedStockForm.get('mobile04').setValue('NA');
    this.sumCollections();
  } else {
    this.quarantinedStockForm.get('mobile04').setValue(0);
  }
}
mobile06_(checked) {
  this.mobile06NaChecked = checked.checked;
  if (checked.checked) {
    this.quarantinedStockForm.get('mobile06').setValue('NA');
    this.sumCollections();
  } else {
    this.quarantinedStockForm.get('mobile06').setValue(0);
  }
}

}
