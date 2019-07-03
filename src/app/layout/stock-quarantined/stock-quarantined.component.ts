import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { QuarantinedStockService } from '../../shared/config/service/quarantined-stock.service';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { StockQuarantined } from 'src/app/shared/config/model/Stock-quarantined.model';
import { BranchService } from 'src/app/shared/config/service/admin/branch.service';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-stock-quarantined',
  templateUrl: './stock-quarantined.component.html',
  styleUrls: ['./stock-quarantined.component.css']
})
export class StockQuarantinedComponent implements OnInit {

  panelOpenState = false;
  quarantinedStockForm: FormGroup;
  branchGroup: FormGroup;
  branches: Branch[];
  userBranch: Branch;
  branchesSize: number;
  stockQuarantined: StockQuarantined;
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


  constructor(private branchService: BranchService, private qStockService: QuarantinedStockService, private fb: FormBuilder) { }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    // this.getUserBranch(this.branchId);
    this.createForms();
    this.loadBranches();
    this.getAllBranches();
       // this.quarantinedStockForm.get('branch').patchValue(localStorage.getItem('BRANCH_NAME'));
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
      branch: new FormControl(),
      todaysDate: new FormControl(),
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
      stockReceivedFrom: this.fb.array([
        this.initStockReceivedFrom()
      ]),
      stockIssuedTo: this.fb.array([
        this.initStockIssuedTo()
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
  OpeningStock(value): number {
    return value.openingStock;
  }

  staticPercentage() {
    this.harareCbd = Math.round((this.quarantinedStockForm.get('harareCbd03').value / 40) * 100);
    this.staticHq = Math.round((this.quarantinedStockForm.get('staticHq01').value / 40) * 100);
  }
  mobPercentage() {
    this.mobile02 = Math.round((this.quarantinedStockForm.get('mobile02').value / 15) * 100);
    this.mobile04 = Math.round((this.quarantinedStockForm.get('mobile04').value / 15) * 100);
    this.mobile06 = Math.round((this.quarantinedStockForm.get('mobile06').value / 15) * 100);
  }

  QuarantineStock(value): number {
    return this.OpeningStock(value) + this.sumCollections(value) + this.sumReceived(value)
     - this.sumDiscards(value) - this.sumIssues(value);
  }

  sumCollections(value): number {
    let total = 0;
    total = value.openingStock + value.harareCbd03 + value.staticHq01
     + value.mobile04 + value.mobile02 + value.mobile06 ;
    this.quarantinedStockForm.get('totalCollections').setValue(total);
    return total;
  }

  sumIssues(value): number {
    let total = 0;
    total = value.issueTogroupMismatchesToRefLab;
    value.stockIssuedTo.forEach(item => {
      total += item.issuedTo;
    });
    this.quarantinedStockForm.get('totalIssues').setValue(total);
    return total;
  }

  sumDiscards(value): number {
    let total = 0;
    total =  value.p1 + value.dryPacksD3D4 + value.p2 +
    value.dryPacksD1 + value.p3 + value.samplesOnly + value.c11 + value.expired
    + value.wrongPack + value.other +  value.serologicalDiscards;
    this.quarantinedStockForm.get('totalIssuesDiscards').setValue(total);
    return total;
  }

  sumReceived(value): number {
    let total = 0;
    total = value.referenceLaboratory;
    value.stockReceivedFrom.forEach(item => {
      total += item.receivedFrom;
    });
    this.quarantinedStockForm.get('totalReceiptsFromBranches').setValue(total);
    return total;
  }

  saveAQuarantinedStock(value) {
    console.log(value);
    this.qStockService.save(value).subscribe(
      result => {

        this.stockQuarantined = result;

      },
      error => {
         console.log(error.error);
      },
      () => {
       this.populateForm(this.stockQuarantined);
      }
    );
  }

  populateForm(item) {
    // console.log(item.branch);
    this.quarantinedStockForm.get('id').setValue(item.id);
    this.quarantinedStockForm.get('dateCreated').setValue(item.dateCreated);
    // this.quarantinedStockForm.get('timeCreated').setValue(item.timeCreated);
    this.quarantinedStockForm.get('version').setValue(item.version);
    this.quarantinedStockForm.get('createdById').setValue(item.createdById);
    this.quarantinedStockForm.get('todaysDate').setValue(item.dateCreated);
    // this.quarantinedStockForm.get('branch.branchName').setValue(item.branch);
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
    // this.quarantinedStockForm.get('stockReceivedFrom').setValue(item.stockReceivedFrom);
    // this.quarantinedStockForm.get('stockIssuedTo').setValue(item.stockIssuedTo);
    // this.quarantinedStockForm.get('todaysDate').setValue(item.todaysDate);
    // this.quarantinedStockForm.get('todaysDate').setValue(item.todaysDate);
    // if (item.stockIssuedTo.length > 0) {
    //   this.StockIssuedToArray.removeAt(0);
    // }
    item.stockIssuedTo.forEach(complaint => {
      this.StockIssuedToArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          issuedTo: new FormControl(complaint.issuedTo),
          // complaintPeriod: new FormControl(complaint.complaintPeriod),
          // duration: new FormControl(complaint.duration),
          // notes: new FormControl(complaint.notes)
        })
      );
    });
  }

  initStockReceivedFrom() {
    return this.fb.group({
      id: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      dateCreated: new FormControl(),
      receivedFrom: new FormControl(),
    });
  }
  get StockReceivedFromArray() {
    return this.quarantinedStockForm.get('stockReceivedFrom') as FormArray;
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
  return this.quarantinedStockForm.get('stockIssuedTo') as FormArray;
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
    },
    () => {
      // this.loadStockReceivedFrom();
      // this.loadStockIssuedTo();
    }
  );
}

 getInitvalues(branchId) {
  console.log(branchId);
  this.qStockService.getAvailableStock(branchId).subscribe(
     result => {
      this.stockQuarantined = result;
      console.log(result);

    },
    error => {
       console.log(error.error);
    },
    () => {

     this.populateForm(this.stockQuarantined);
    }
   );
 }
 compareByValue(f1: any, f2: any) {
  return f1 && f2 && f1.id === f2.id;
}

}
