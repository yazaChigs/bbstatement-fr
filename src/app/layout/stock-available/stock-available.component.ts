import { Component, OnInit } from '@angular/core';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Branch } from '../../shared/config/model/admin/branch.model';
import { BranchService } from 'src/app/shared/config/service/admin/branch.service';
import { StockAvailable } from 'src/app/shared/config/model/stock-available.model';
import { UserService } from '../../shared/config/service/admin/user.service';
import { StorageKey } from 'src/app/util/key';

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
  stockAvailable: StockAvailable;
  branch: object;
  issuedToTotal: number;
  cardStockAvailable = 0;
  totalReceivedIssues = 0;
  totalReceivedStock = 0;
  branchId: number;
  AllBranches: Branch[];
  selected: Branch;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  // user = localStorage.getItem('USER');

  constructor(private availableStockService: AvailableStockService, private fb: FormBuilder,
              private branchService: BranchService, private userService: UserService) {
              }

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.getUserBranch();
    this.createForms();
    this.loadBranches();
    this.getAllBranches();
    this.getInitvalues(this.branchId);

  }
  createForms() {
    this.availableStockForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branch: new FormControl(),
      todaysDate: new FormControl(),
      openingStock: new FormControl(),
      receivedFromQuarantine: new FormControl(),
      totalAvailable: new FormControl(),
      hospitals: new FormControl(),
      receicedFromQuarantine: new FormControl(),
      issueToCompats: new FormControl(),
      expired: new FormControl(),
      disasters: new FormControl(),
      haemolysed_clots_other: new FormControl(),
      wholeBloodToPackedCells: new FormControl(),
      totalIssues: new FormControl(),
      totalHospitalOrders: new FormControl(),
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
      ffp1: new FormControl(),
      plt1: new FormControl(),
      plt2: new FormControl(),
      cryo: new FormControl(),
      paedPacks: new FormControl(),
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

  populateNewForm() {
    this.availableStockForm.get('id').setValue('');
    this.availableStockForm.get('dateCreated').setValue('');
    this.availableStockForm.get('version').setValue('');
    this.availableStockForm.get('createdById').setValue('');
  }
  populateForm(item) {
    this.availableStockForm.get('id').setValue(item.id);
    this.availableStockForm.get('dateCreated').setValue(item.dateCreated);
    this.availableStockForm.get('version').setValue(item.version);
    this.availableStockForm.get('createdById').setValue(item.createdById);
    // this.availableStockForm.get('branchName').setValue(item.brancName);

    this.availableStockForm.get('receivedFromAvailable').reset();
    if (item.receivedFromAvailable.length > 0) {
      item.receivedFromAvailable.forEach(element => {
        this.StockReceivedFromArray.removeAt(0);
      });
    }
    console.log(item.receivedFromAvailable);
    item.receivedFromAvailable.forEach(complaint => {
     if (complaint.receivedFrom !== null) {
        this.StockReceivedFromArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          branchName: new FormControl(complaint.branchName),
          receivedFrom: new FormControl(complaint.receivedFrom),
        })
      );
     }
    });
    this.availableStockForm.get('issuedToAvailable').reset();
    if (item.issuedToAvailable.length > 0) {
      item.issuedToAvailable.forEach(element => {
        this.StockIssuedToArray.removeAt(0);
      });
    }
    console.log(item.issuedToAvailable);
    item.issuedToAvailable.forEach(complaint => {
     if (complaint.issuedTo !== null) {
        this.StockIssuedToArray.push(
        this.fb.group({
          id: new FormControl(complaint.id),
          version: new FormControl(complaint.version),
          createdById: new FormControl(complaint.createdById),
          dateCreated: new FormControl(complaint.dateCreated),
          branchName: new FormControl(complaint.branchName),
          issuedTo: new FormControl(complaint.issuedTo),
        })
      );
     }
    });
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

  loadBranches() {
    this.branchService.getAllForUser().subscribe(
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

  getInitvalues(branchId) {
    this.availableStockService.getAvailableStock(branchId).subscribe(
     result => {
      this.stockAvailable = result;
      if (this.stockAvailable != null) {
        this.populateForm(this.stockAvailable);
      } else {
        this.populateNewForm();
      }
      console.log(this.stockAvailable);
     },
     error => {
        console.log(error.error);
     },
    );
  }

  saveStockAvailable(value) {
    this.availableStockService.save(value).subscribe(
      result => {
        this.stockAvailable = result.stockAvailable;
        console.log(this.stockAvailable);
        console.log(result.message);
      },
      error => {
         console.log(error.error);
      },
      () => {
       this.populateForm(this.stockAvailable);
      }
    );
  }
  initStockReceivedFrom(ds?) {
    return this.fb.group({
      id: new FormControl(),
      version: new FormControl(),
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
    total = value.openingStock + value.receivedFromQuarantine;
    value.receivedFromAvailable.forEach(item => {
    total += Number(item.receivedFrom);
    });
    this.availableStockForm.get('totalAvailable').setValue(total);
    this.cardStockAvailable =  total - value.totalIssues;

  }

  sumIssued(value){
    let total = 0;
    total = value.hospitals + value.receicedFromQuarantine + value.issueToCompats
     + value.expired + value.disasters + value.haemolysed_clots_other + value.wholeBloodToPackedCells;
    value.issuedToAvailable.forEach(item => {
      total += Number(item.issuedTo);
    });
    this.availableStockForm.get('totalIssues').setValue(total);
    this.cardStockAvailable =  value.totalAvailable - total;
  }

  demandVsSupply(value): number {
    return (Math.floor((this.overallSupplies(value)  / this.overallOrders(value)) * 100));
  }

  overallSupplies(value): number {
    let total = 0;
    return total = value.hospitals + value.compatsIssues;
  }

  overallOrders(value): number {
    let total = 0;
    return total = value.totalHospitalOrders + value.compatsOrders;
  }
  // ****TABLE****
  sumRhPositiveWb(value) {
    let total = 0;
    total = value.rhPositiveWbO + value.rhPositiveWbA +
     value.rhPositiveWbB + value.rhPositiveWbAB;
    this.availableStockForm.get('totalRhPositiveWb').setValue(total);
  }
  sumRhPositivePc(value) {
    let total = 0;
    total = value.rhPositivePcO + value.rhPositivePcA +
     value.rhPositivePcB + value.rhPositivePcAB;
    this.availableStockForm.get('totalRhPositivePc').setValue(total);
  }
  sumRhPositivePaedWb(value) {
    let total = 0;
    total = value.rhPositivePaedWbO + value.rhPositivePaedWbA +
     value.rhPositivePaedWbB + value.rhPositivePaedWbAB;
    this.availableStockForm.get('totalRhPositivePaedWb').setValue(total);
  }
  sumRhPositivePaedPc(value) {
    let total = 0;
    total = value.rhPositivePaedPcO + value.rhPositivePaedPcA +
     value.rhPositivePaedPcB + value.rhPositivePaedPcAB;
    this.availableStockForm.get('totalRhPositivePaedPc').setValue(total);
  }

  sumRhNegativeWb(value) {
    let total = 0;
    total = value.rhNegativeWbO + value.rhNegativeWbA +
     value.rhNegativeWbB + value.rhNegativeWbAB;
    this.availableStockForm.get('totalRhNegativeWb').setValue(total);
  }
  sumRhNegativePc(value) {
    let total = 0;
    total = value.rhNegativePcO + value.rhNegativePcA +
     value.rhNegativePcB + value.rhNegativePcAB;
    this.availableStockForm.get('totalRhNegativePc').setValue(total);
  }
  sumRhNegativePaedWb(value) {
    let total = 0;
    total = value.rhNegativePaedWbO + value.rhNegativePaedWbA +
     value.rhNegativePaedWbB + value.rhNegativePaedWbAB;
    this.availableStockForm.get('totalRhNegativePaedWb').setValue(total);
  }
  sumRhNegativePaedPc(value) {
    let total = 0;
    total = value.rhNegativePaedPcO + value.rhNegativePaedPcA +
     value.rhNegativePaedPcB + value.rhNegativePaedPcAB;
    this.availableStockForm.get('totalRhNegativePaedPc').setValue(total);
  }
  totalVertical() {
    let total = 0;
    total = this.availableStockForm.get('totalO').value
    + this.availableStockForm.get('totalA').value
    + this.availableStockForm.get('totalB').value
    + this.availableStockForm.get('totalAB').value;
    this.availableStockForm.get('totalTotal').setValue(total);

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
    value.rhPositiveWbO +
    value.rhPositivePcO +
    value.rhPositivePaedWbO +
    value.rhPositivePaedPcO +
    value.rhNegativeWbO +
    value.rhNegativePcO +
    value.rhNegativePaedWbO +
    value.rhNegativePaedPcO;
    this.availableStockForm.get('totalO').setValue(total);
    this.totalVertical();
  }
  totalA(value) {
    let total = 0;
    total =
    value.rhPositiveWbA +
    value.rhPositivePcA +
    value.rhPositivePaedWbA +
    value.rhPositivePaedPcA +
    value.rhNegativeWbA +
    value.rhNegativePcA +
    value.rhNegativePaedWbA +
    value.rhNegativePaedPcA;
    this.availableStockForm.get('totalA').setValue(total);
    this.totalVertical();
  }
  totalB(value) {
    let total = 0;
    total =
    value.rhPositiveWbB +
    value.rhPositivePcB +
    value.rhPositivePaedWbB +
    value.rhPositivePaedPcB +
    value.rhNegativeWbB +
    value.rhNegativePcB +
    value.rhNegativePaedWbB +
    value.rhNegativePaedPcB;
    this.availableStockForm.get('totalB').setValue(total);
    this.totalVertical();
  }
  totalAB(value) {
    let total = 0;
    total =
    value.rhPositiveWbAB +
    value.rhPositivePcAB +
    value.rhPositivePaedWbAB +
    value.rhPositivePaedPcAB +
    value.rhNegativeWbAB +
    value.rhNegativePcAB +
    value.rhNegativePaedWbAB +
    value.rhNegativePaedPcAB;
    this.availableStockForm.get('totalAB').setValue(total);
    this.totalVertical();
  }
  totalHorizontal(value) {
    let total = 0;
    total =
    value.totalRhPositiveWb +
    value.totalRhPositivePc +
    value.totalRhPositivePaedWb +
    value.totalRhPositivePaedPc +
    value.totalRhNegativeWb +
    value.totalRhNegativePc +
    value.totalRhNegativePaedWb +
    value.totalRhNegativePaedPc;
    this.availableStockForm.get('totalTotal').setValue(total);
  }

  comSumRhPositiveWb(value) {
    let total = 0;
    total = value.rhPositiveWbOcompatibility + value.rhPositiveWbAcompatibility +
     value.rhPositiveWbBcompatibility + value.rhPositiveWbABcompatibility;
    this.availableStockForm.get('totalRhPositiveWbcompatibility').setValue(total);
  }
  comSumRhPositivePc(value) {
    let total = 0;
    total = value.rhPositivePcOcompatibility + value.rhPositivePcAcompatibility +
     value.rhPositivePcBcompatibility + value.rhPositivePcABcompatibility;
    this.availableStockForm.get('totalRhPositivePccompatibility').setValue(total);
  }
  comSumRhPositivePaedWb(value) {
    let total = 0;
    total = value.rhPositivePaedWbOcompatibility + value.rhPositivePaedWbAcompatibility +
     value.rhPositivePaedWbBcompatibility + value.rhPositivePaedWbABcompatibility;
    this.availableStockForm.get('totalRhPositivePaedWbcompatibility').setValue(total);
  }
  comSumRhPositivePaedPc(value) {
    let total = 0;
    total = value.rhPositivePaedPcOcompatibility + value.rhPositivePaedPcAcompatibility +
     value.rhPositivePaedPcBcompatibility + value.rhPositivePaedPcABcompatibility;
    this.availableStockForm.get('totalRhPositivePaedPccompatibility').setValue(total);
  }

  comSumRhNegativeWb(value) {
    let total = 0;
    total = value.rhNegativeWbOcompatibility + value.rhNegativeWbAcompatibility +
     value.rhNegativeWbBcompatibility + value.rhNegativeWbABcompatibility;
    this.availableStockForm.get('totalRhNegativeWbcompatibility').setValue(total);
  }
  comSumRhNegativePc(value) {
    let total = 0;
    total = value.rhNegativePcOcompatibility + value.rhNegativePcAcompatibility +
     value.rhNegativePcBcompatibility + value.rhNegativePcABcompatibility;
    this.availableStockForm.get('totalRhNegativePccompatibility').setValue(total);
  }
  comSumRhNegativePaedWb(value) {
    let total = 0;
    total = value.rhNegativePaedWbOcompatibility + value.rhNegativePaedWbAcompatibility +
     value.rhNegativePaedWbBcompatibility + value.rhNegativePaedWbABcompatibility;
    this.availableStockForm.get('totalRhNegativePaedWbcompatibility').setValue(total);
  }
  comSumRhNegativePaedPc(value) {
    let total = 0;
    total = value.rhNegativePaedPcOcompatibility + value.rhNegativePaedPcAcompatibility +
     value.rhNegativePaedPcBcompatibility + value.rhNegativePaedPcABcompatibility;
    this.availableStockForm.get('totalRhNegativePaedPccompatibility').setValue(total);
  }
  comTotalVertical() {
    let total = 0;
    total = this.availableStockForm.get('totalOcompatibility').value
    + this.availableStockForm.get('totalAcompatibility').value
    + this.availableStockForm.get('totalBcompatibility').value
    + this.availableStockForm.get('totalABcompatibility').value;
    this.availableStockForm.get('totalTotalcompatibility').setValue(total);

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
    value.rhPositiveWbOcompatibility +
    value.rhPositivePcOcompatibility +
    value.rhPositivePaedWbOcompatibility +
    value.rhPositivePaedPcOcompatibility +
    value.rhNegativeWbOcompatibility +
    value.rhNegativePcOcompatibility +
    value.rhNegativePaedWbOcompatibility +
    value.rhNegativePaedPcOcompatibility;
    this.availableStockForm.get('totalOcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalA(value) {
    let total = 0;
    total =
    value.rhPositiveWbAcompatibility +
    value.rhPositivePcAcompatibility +
    value.rhPositivePaedWbAcompatibility +
    value.rhPositivePaedPcAcompatibility +
    value.rhNegativeWbAcompatibility +
    value.rhNegativePcAcompatibility +
    value.rhNegativePaedWbAcompatibility +
    value.rhNegativePaedPcAcompatibility;
    this.availableStockForm.get('totalAcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalB(value) {
    let total = 0;
    total =
    value.rhPositiveWbBcompatibility +
    value.rhPositivePcBcompatibility +
    value.rhPositivePaedWbBcompatibility +
    value.rhPositivePaedPcBcompatibility +
    value.rhNegativeWbBcompatibility +
    value.rhNegativePcBcompatibility +
    value.rhNegativePaedWbBcompatibility +
    value.rhNegativePaedPcBcompatibility;
    this.availableStockForm.get('totalBcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalAB(value) {
    let total = 0;
    total =
    value.rhPositiveWbABcompatibility +
    value.rhPositivePcABcompatibility +
    value.rhPositivePaedWbABcompatibility +
    value.rhPositivePaedPcABcompatibility +
    value.rhNegativeWbABcompatibility +
    value.rhNegativePcABcompatibility +
    value.rhNegativePaedWbABcompatibility +
    value.rhNegativePaedPcABcompatibility;
    this.availableStockForm.get('totalABcompatibility').setValue(total);
    this.comTotalVertical();
  }
  comTotalHorizontal(value) {
    let total = 0;
    total =
    value.totalRhPositiveWbcompatibility +
    value.totalRhPositivePccompatibility +
    value.totalRhPositivePaedWbcompatibility +
    value.totalRhPositivePaedPccompatibility +
    value.totalRhNegativeWbcompatibility +
    value.totalRhNegativePccompatibility +
    value.totalRhNegativePaedWbcompatibility +
    value.totalRhNegativePaedPccompatibility;
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
