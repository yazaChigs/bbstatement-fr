import { Component, OnInit } from '@angular/core';
import { DataManagementService } from '../../../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { NoDaysRequiremets } from 'src/app/shared/config/model/admin/no-days-requirements.model';
import { AvailableStockService } from '../../../../shared/config/service/available-stock.service';
import { StockAvailable } from '../../../../shared/config/model/stock-available.model';

@Component({
  selector: 'app-BloodGroup-DaysSupply',
  templateUrl: './BloodGroup-DaysSupply.component.html',
  styleUrls: ['./BloodGroup-DaysSupply.component.css']
})
export class BloodGroupDaysSupplyComponent implements OnInit {

  plusO: any;
  minusO: any;
  plusA: any;
  plusB: any;
  showItems = false;
  noDaysRequiremets: NoDaysRequiremets = new NoDaysRequiremets();
  stockAvailable: StockAvailable = new StockAvailable();
  branchId: number;
  stockedOplus: number;
  stockedOminus: number;
  stockedAplus: number;
  stockedBplus: number;

  constructor(public dataManService: DataManagementService, private availableStockService: AvailableStockService) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Latest'];
  public barChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartData = [
    {data: [this.plusO] , label: 'O+'},
    {data: [this.minusO], label: 'O-'},
    {data: [this.plusA], label: 'A+'},
    {data: [this.plusB], label: 'B+'}
  ];

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.getAvailableStockForm();
    // this.getBranchDailyRequirements();
  }

  getAvailableStockForm() {
    this.availableStockService.getAvailableStock(this.branchId).subscribe(
      result => {
        if (result !== null ) {
        this.stockAvailable = result;
        this.stockedOplus = this.stockAvailable.rhPositiveWbOcompatibility + this.stockAvailable.rhPositivePcOcompatibility
         + this.stockAvailable.rhPositivePaedWbOcompatibility + this.stockAvailable.rhPositivePaedPcOcompatibility
         + this.stockAvailable.rhPositiveWbO + this.stockAvailable.rhPositivePcO + this.stockAvailable.rhPositivePaedWbO
         + this.stockAvailable.rhPositivePaedPcO ;
         console.log(this.stockedOplus);
        this.stockedOminus = this.stockAvailable.rhNegativeWbOcompatibility + this.stockAvailable.rhNegativePcOcompatibility
        + this.stockAvailable.rhNegativePaedWbOcompatibility + this.stockAvailable.rhNegativePaedPcOcompatibility
        + this.stockAvailable.rhNegativeWbO + this.stockAvailable.rhNegativePcO + this.stockAvailable.rhNegativePaedWbO
        + this.stockAvailable.rhNegativePaedPcO;
        this.stockedAplus = this.stockAvailable.rhPositiveWbAcompatibility + this.stockAvailable.rhPositivePcAcompatibility
         + this.stockAvailable.rhPositivePaedWbAcompatibility + this.stockAvailable.rhPositivePaedPcAcompatibility
         + this.stockAvailable.rhPositiveWbA + this.stockAvailable.rhPositivePcA + this.stockAvailable.rhPositivePaedWbA
         + this.stockAvailable.rhPositivePaedPcA;
        this.stockedBplus = this.stockAvailable.rhPositiveWbBcompatibility + this.stockAvailable.rhPositivePcBcompatibility
         + this.stockAvailable.rhPositivePaedWbBcompatibility + this.stockAvailable.rhPositivePaedPcBcompatibility
         + this.stockAvailable.rhPositiveWbB + this.stockAvailable.rhPositivePcB + this.stockAvailable.rhPositivePaedWbB
         + this.stockAvailable.rhPositivePaedPcB;
    this.getBranchDailyRequirements();

      }
      }, error => {
        console.log(error.error);
      },
    );
  }

  getBranchDailyRequirements() {
    this.dataManService.getNoDaysRequiremets().subscribe(
      result => {
        this.noDaysRequiremets = result;
        if (this.noDaysRequiremets !== null ) {
          this.plusO =  this.stockedOplus / this.noDaysRequiremets.nationalRequirementsOplus ;
          console.log(this.plusO);
          console.log(this.stockedOplus);
          console.log(this.noDaysRequiremets.nationalRequirementsOplus);


          this.minusO = this.stockedOminus / this.noDaysRequiremets.nationalRequirementsOminus;

          this.plusA = this.stockedAplus / this.noDaysRequiremets.nationalRequirementsAplus;

          this.plusB = this.stockedBplus / this.noDaysRequiremets.nationalRequirementsBplus;
          // this.pain = data.pain;
          console.log(this.minusO);
        }
      }, error => {
        console.log(error.error);
      },
      () => {
        this.barChartData = [
          {data: [this.plusO] , label: 'O+'},
          {data: [this.minusO], label: 'O-'},
          {data: [this.plusA], label: 'A+'},
          {data: [this.plusB], label: 'B+'},
          // {data: [this.selfImage], label: 'selfImage'},
          // {data: [temp], label: 'Total'}
        ];
        if (this.noDaysRequiremets !== null) {
          this.showItems = true;
        } else {
          this.showItems = false;
        }
      }
    );
  }

}
