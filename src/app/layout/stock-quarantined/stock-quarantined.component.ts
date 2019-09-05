import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
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
  editBranches = true;
  roles: string[];
  util;
  yesterdayDate: any;
  editForm = true;
  showEditBtn = false;

  constructor(private branchService: BranchService, private dataManService: DataManagementService, private dashService: DashboardService,
              private qStockService: QuarantinedStockService, private fb: FormBuilder, private snotify: SnotifyService) { }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    // this.getUserBranch(this.branchId);
    this.getBranchTotalMinCapacity();
    this.setYesterdayDate();
    this.createForms();
    this.loadBranches(this.branchId);
    this.getAllBranches();
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    if (this.roles.includes('ROLE_GLOBAL') || this.roles.includes('ROLE_SUPERVISOR')) {
      this.editBranches = false; }

    this.util = new NotifyUtil(this.snotify);
  }


  setYesterdayDate() {
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    this.yesterdayDate = yDate;
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
    return this.colorIndicator(this.quarantinedStockForm.get('staticHq01').value / 15);
    }
  harareCbdColor(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('harareCbd03').value / 15);
    }
    mobile04Color(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('mobile04').value / 40);
    }
    mobile02Color(): string {
    return this.colorIndicator(this.quarantinedStockForm.get('mobile02').value / 40);
    }
    mobile06Color(): string {
      return this.colorIndicator(this.quarantinedStockForm.get('mobile06').value / 40);
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
        // {disabled: this.editBranches}
      ),
      todaysDate: new FormControl(this.yesterdayDate),
      openingStock: new FormControl(),
      harareCbd03: new FormControl(),
      staticHq01: new FormControl(),
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
    if (this.branchTotalMinCapacity !== null) {
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
    if (this.initCollectionsFromDb !== 0) {
    return this.quarantinedStockForm.get('totalCollections').value / this.initCollectionsFromDb;
    } else { return 0; }
  }
  OpeningStock(value): number {
    return value.openingStock;
  }

  staticPercentage() {
    this.harareCbd = Math.round((this.quarantinedStockForm.get('harareCbd03').value / 15) * 100);
    this.staticHq = Math.round((this.quarantinedStockForm.get('staticHq01').value / 15) * 100);
  }
  mobPercentage() {
    this.mobile02 = Math.round((this.quarantinedStockForm.get('mobile02').value / 40) * 100);
    this.mobile04 = Math.round((this.quarantinedStockForm.get('mobile04').value / 40) * 100);
    this.mobile06 = Math.round((this.quarantinedStockForm.get('mobile06').value / 40) * 100);
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
    console.log('summing collections');
    if (this.quarantinedStockForm.get('harareCbd03').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('harareCbd03').value);
    }
    if (this.quarantinedStockForm.get('mobile02').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile02').value);
    }
    if (this.quarantinedStockForm.get('mobile04').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile04').value);
    }
    if (this.quarantinedStockForm.get('staticHq01').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('staticHq01').value);
    }
    if (this.quarantinedStockForm.get('mobile06').value !== 'NA') {
      total += Number(this.quarantinedStockForm.get('mobile06').value);
    }
    console.log(total);
    this.quarantinedStockForm.get('totalCollections').setValue(total);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(
      total + Number(this.quarantinedStockForm.get('openingStock').value)
       + Number(this.quarantinedStockForm.get('referenceLaboratory').value));
    return total;
  }
  totolCollectionsOnly(): number {
    return Number(this.quarantinedStockForm.get('totalCollections').value)
    + Number(this.quarantinedStockForm.get('openingStock').value);
  }

  initCollectionsValue(): number {
    return this.quarantinedStockForm.get('totalIssues').value
    + this.quarantinedStockForm.get('availableStock').value;
  }

  sumIssues(value): number {
    let total = 0;
    value.issuedToQuarantines.forEach(item => {
      total += Number(item.issuedTo);
    });
    this.quarantinedStockForm.get('totalBloodTransferredToOtherBranches').setValue(total);
    total += Number(value.issueTogroupMismatchesToRefLab) + Number(value.availableStock);
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

  sumReceived(): number {
    console.log('sumRecieved');
    let total = 0;
    // total = Number(this.quarantinedStockForm.get('referenceLaboratory').value);
    this.StockReceivedFromArray.controls.forEach((item, index) => {
      const valueTotal = Number(this.getStockReceivedFromControls()[index].value.receivedFrom);
      total += valueTotal;
    });
    this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').setValue(total);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(
      total + Number(this.quarantinedStockForm.get('referenceLaboratory').value));
    return total +  Number(this.quarantinedStockForm.get('referenceLaboratory').value);
  }

  saveAQuarantinedStock(value) {
    this.showEditBtn = false;
    console.log(value);
    console.log(this.branches);
    this.qStockService.save(value).subscribe(
      result => {
        this.stockQuarantined = result.stockQuarantined;
        if (this.stockQuarantined! == null) {
          this.editForm = result.active;
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
      //  this.populateNewForm();
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
    this.quarantinedStockForm.get('harareCbd03').setValue('');
    this.quarantinedStockForm.get('staticHq01').setValue('');
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
    this.quarantinedStockForm.get('cryo').setValue('');
  }

  populateForm(item) {
    // console.log(item.branch);
    this.quarantinedStockForm.get('id').setValue(item.id);
    this.quarantinedStockForm.get('dateCreated').setValue(item.dateCreated);
    this.quarantinedStockForm.get('version').setValue(item.version);
    this.quarantinedStockForm.get('createdById').setValue(item.createdById);
    this.quarantinedStockForm.get('openingStock').setValue(item.openingStock);
    if (item.harareCbd03 === 'NA') {
      this.harareCbdNaChecked = true;
    } else {
      this.harareCbdNaChecked = false;
    }
    this.quarantinedStockForm.get('harareCbd03').setValue(item.harareCbd03);
    if (item.staticHq01 === 'NA') {
      this.staticHqNaChecked = true;
    } else {
      this.staticHqNaChecked = false;
    }
    this.quarantinedStockForm.get('staticHq01').setValue(item.staticHq01);
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
    this.quarantinedStockForm.get('totalReceiptsFromBranchesOnly').setValue(item.totalReceiptsFromBranches);
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
    return (<FormArray>this.quarantinedStockForm.get('receivedFromQuarantineds')).controls;
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
    },
    error => {
      console.log(error.error);
    },
    () => {
      const toSelect = this.allBranches.find(c => c.id === this.branchId);
      this.quarantinedStockForm.get('branch').setValue(toSelect);
      this.getInitvalues(this.branchId);

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
 getInitvalues(branchId) {
  this.qStockService.getAvailableStock(branchId).subscribe(
     result => {
      this.stockQuarantined = result;
      if (this.stockQuarantined !== null && this.stockQuarantined.issuedToQuarantines.length === 0) {
        // this.loadStockIssuedTo();
      }
      if (this.stockQuarantined !== null) {
        this.editForm = result.active;
        this.populateForm(this.stockQuarantined);
        this.calculateCollections(); // supposed to be in ther above loop
      }
      if (this.stockQuarantined === null) {
        this.showEditBtn = false; // console.log(result.message);
        this.editForm = true;
        this.populateNewForm();
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
        this.populateForm(this.stockQuarantined);
        this.calculateCollections(); // supposed to be in ther above loop
      }
      if (this.stockQuarantined === null) {
        this.populateNewForm();
      }
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

 compareByValue(f1: any, f2: any) {
  return f1 && f2 && f1.id === f2.id;
}
staticHqNA(checked) {
    this.staticHqNaChecked = checked.checked;
    if (checked.checked) {
      this.quarantinedStockForm.get('staticHq01').setValue('NA');
      this.sumCollections();
    } else {
      this.quarantinedStockForm.get('staticHq01').setValue(0);
      this.sumCollections();
    }
}
HarareCbd03(checked) {
  this.harareCbdNaChecked = checked.checked;
  if (checked.checked) {
    this.quarantinedStockForm.get('harareCbd03').setValue('NA');
    this.sumCollections();
  } else {
    this.quarantinedStockForm.get('harareCbd03').setValue(0);
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
