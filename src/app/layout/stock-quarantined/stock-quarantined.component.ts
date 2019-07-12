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
  staticHq = 0;
  mobile02 = 0;
  mobile04 = 0;
  mobile06 = 0;
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

  constructor(private branchService: BranchService, private dataManService: DataManagementService,
              private qStockService: QuarantinedStockService, private fb: FormBuilder) { }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.getBranchTotalMinCapacity();
    // this.getUserBranch(this.branchId);
    this.createForms();
    this.loadBranches();
    this.getAllBranches();
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    if (this.roles.includes('ROLE_GLOBAL') || this.roles.includes('ROLE_SUPER_ADMIN')) {
      this.editBranches = false; }
  }

  collectionsBgColor() {

    this.collectionsIndicator = ((this.initCollections - this.initOpeningStock) / this.initCollectionsFromDb);
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
      todaysDate: new FormControl(new Date().toLocaleDateString()),
      openingStock: new FormControl(),
      harareCbd03: new FormControl(),
      staticHq01: new FormControl(),
      mobile04: new FormControl(),
      mobile02: new FormControl(),
      mobile06: new FormControl(),
      totalCollections: new FormControl(),
      referenceLaboratory: new FormControl(),
      totalReceiptsFromBranches: new FormControl(),
      p1: new FormControl(),
      dryPacksD3D4: new FormControl(),
      p2: new FormControl(),
      dryPacksD1: new FormControl(),
      p3: new FormControl(),
      samplesOnly: new FormControl(),
      c11: new FormControl(),
      expired: new FormControl(),
      wrongPack: new FormControl(),
      other: new FormControl(),
      serologicalDiscards: new FormControl(),
      totalIssuesDiscards: new FormControl(),
      availableStock: new FormControl(),
      issueTogroupMismatchesToRefLab: new FormControl(),
      totalIssues: new FormControl(),
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
        console.log(result);
        this.branchTotalMinCapacity = result;
        this.calculateCollections();
      },
      error => {
        console.log(error.error);
     },
     () => {
     }
    );
  }
  calculateCollections() {
    if (this.branchTotalMinCapacity !== null && this.branchTotalMinCapacity !== undefined) {
      this.initCollectionsFromDb = this.branchTotalMinCapacity.harareTotalMinCapacity;
    }
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

  QuarantineStock() {
    return this.quarantinedStockForm.get('totalCollections').value
      + this.quarantinedStockForm.get('totalReceiptsFromBranches').value
      - this.quarantinedStockForm.get('totalIssuesDiscards').value
      - this.quarantinedStockForm.get('totalIssues').value;
  }

  sumCollections(value): number {
    let total = 0;
    total = Number(value.openingStock) + Number(value.harareCbd03) + Number(value.staticHq01)
     + Number(value.mobile04) + Number(value.mobile02) + Number(value.mobile06) ;
    this.quarantinedStockForm.get('totalCollections').setValue(total);
    return total;
  }
  totolCollectionsOnly(): number {
    return this.quarantinedStockForm.get('totalCollections').value;
  }

  sumIssues(value): number {
    let total = 0;
    total = Number(value.issueTogroupMismatchesToRefLab);
    value.issuedToQuarantines.forEach(item => {
      total += Number(item.issuedTo);
    });
    this.quarantinedStockForm.get('totalIssues').setValue(total);
    return total;
  }

  sumDiscards(value): number {
    let total = 0;
    total =  Number(value.p1) + Number(value.dryPacksD3D4) + Number(value.p2) +
    Number(value.dryPacksD1) + Number(value.p3) + Number(value.samplesOnly) + Number(value.c11) + Number(value.expired)
    + Number(value.wrongPack) + Number(value.other) +  Number(value.serologicalDiscards);
    this.quarantinedStockForm.get('totalIssuesDiscards').setValue(total);
    return total;
  }

  sumReceived(): number {
    console.log('sumRecieved');
    let total = 0;
    total = Number(this.quarantinedStockForm.get('referenceLaboratory').value);
    this.StockReceivedFromArray.controls.forEach((item, index) => {
      const valueTotal = Number(this.getStockReceivedFromControls()[index].value.receivedFrom);
      total += valueTotal;
    });
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(total);
    return total;
  }

  saveAQuarantinedStock(value) {
    console.log(value);
    this.qStockService.save(value).subscribe(
      result => {
        this.stockQuarantined = result.stockQuarantined;
        console.log(result.stockQuarantined);
        console.log(result.message);
      },
      error => {
         console.log(error.error);
      },
      () => {
       this.populateForm(this.stockQuarantined);
      }
    );
  }

  submitStockQuarantined(value) {
    this.qStockService.submit(value).subscribe(
      result => {
        console.log(result.message);
      },
      error => {
         console.log(error.error);
      },
      () => {
       this.populateNewForm();
      }
    );
  }

  populateNewForm() {
    console.log('reseting');
    this.quarantinedStockForm.get('id').setValue('');
    this.quarantinedStockForm.get('dateCreated').setValue('');
    this.quarantinedStockForm.get('version').setValue('');
    this.quarantinedStockForm.get('createdById').setValue('');
    this.quarantinedStockForm.get('issuedToQuarantines').reset();
    this.quarantinedStockForm.get('receivedFromQuarantineds').reset();
    // this.
    // this.loadStockIssuedTo();
    // this.quarantinedStockForm.get('todaysDate').setValue('');
    this.quarantinedStockForm.get('openingStock').setValue('');
    this.quarantinedStockForm.get('harareCbd03').setValue('');
    this.quarantinedStockForm.get('staticHq01').setValue('');
    this.quarantinedStockForm.get('mobile04').setValue('');
    this.quarantinedStockForm.get('mobile02').setValue('');
    this.quarantinedStockForm.get('mobile06').setValue('');
    this.quarantinedStockForm.get('totalCollections').setValue('');
    this.quarantinedStockForm.get('referenceLaboratory').setValue('');
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue('');
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
    // this.quarantinedStockForm.get('timeCreated').setValue(item.timeCreated);
    this.quarantinedStockForm.get('version').setValue(item.version);
    this.quarantinedStockForm.get('createdById').setValue(item.createdById);
    // this.quarantinedStockForm.get('branch.branchName').setValue(item.branch);
    // this.quarantinedStockForm.get('todaysDate').setValue(item.todayDate);
    this.quarantinedStockForm.get('openingStock').setValue(item.openingStock);
    this.quarantinedStockForm.get('harareCbd03').setValue(item.harareCbd03);
    this.quarantinedStockForm.get('staticHq01').setValue(item.staticHq01);
    this.quarantinedStockForm.get('mobile04').setValue(item.mobile04);
    this.quarantinedStockForm.get('mobile02').setValue(item.mobile02);
    this.quarantinedStockForm.get('mobile06').setValue(item.mobile06);
    this.quarantinedStockForm.get('totalCollections').setValue(item.totalCollections);
    this.quarantinedStockForm.get('referenceLaboratory').setValue(item.referenceLaboratory);
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(item.totalReceiptsFromBranches);
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
      receivedFrom: new FormControl(0),
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


 initStockIssuedTo() {
  return this.fb.group({
    id: new FormControl(),
    version: new FormControl(),
    createdById: new FormControl(),
    dateCreated: new FormControl(),
    issuedTo: new FormControl(),
  });
}
get StockIssuedToArray() {
  return this.quarantinedStockForm.get('issuedToQuarantines') as FormArray;
}
loadStockIssuedTo() {
  this.branches.forEach(ds => {
    this.StockIssuedToArray.push(this.initStockIssuedTo());
  });
}


 loadBranches() {
   this.branchService.getAllForUser().subscribe(
     result => {
      this.branches = result;
      console.log(this.branches);
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
     console.log(this.allBranches);
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
        console.log('hamuna chinhu');
        // this.loadStockIssuedTo();
      }
      if (this.stockQuarantined !== null) {
        this.populateForm(this.stockQuarantined);
      }
      if (this.stockQuarantined === null) {
        this.populateNewForm();
      }
      console.log(result);
    },
    error => {
       console.log(error.error);
    },
   );
 }
 compareByValue(f1: any, f2: any) {
  return f1 && f2 && f1.id === f2.id;
}

}
