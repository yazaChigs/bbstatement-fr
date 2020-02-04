import { Component, OnInit , Input, OnChanges, SimpleChanges} from '@angular/core';
import { DataManagementService } from '../../../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { NoDaysRequiremets } from 'src/app/shared/config/model/admin/no-days-requirements.model';
import { AvailableStockService } from '../../../../shared/config/service/available-stock.service';
import { StockAvailable } from '../../../../shared/config/model/stock-available.model';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-BloodGroup-DaysSupply',
  templateUrl: './BloodGroup-DaysSupply.component.html',
  styleUrls: ['./BloodGroup-DaysSupply.component.css']
})
export class BloodGroupDaysSupplyComponent implements OnInit, OnChanges {

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
  availableStockTotal: number;
  branchesInfo: any = {};
  @Input() branchData: any = {};

  constructor( private dashService: DashboardService, public dataManService: DataManagementService,
               private availableStockService: AvailableStockService) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'left',
    },
  };
  public barChartLabels = ['Latest'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [this.plusO] , label: 'O+'},
    {data: [this.minusO], label: 'O-'},
    {data: [this.plusA], label: 'A+'},
    {data: [this.plusB], label: 'B+'},
    {data: [this.availableStockTotal], label: 'total'},
  ];

  ngOnInit() {
    this.branchId = Number(localStorage.getItem('BRANCH_ID'));
    this.fillChart(this.branchData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fillChart(this.branchData);
  }

  fillChart(branchData: any) {
    if (branchData !== null ) {
      this.plusO = this.branchData.stockedOplus / this.branchData.dailyReqOplus;
      this.minusO = this.branchData.stockedOminus / this.branchData.dailyReqOminus ;
      this.plusA =  this.branchData.stockedAplus / this.branchData.dailyReqAplus;
      this.plusB =  this.branchData.stockedBplus / this.branchData.dailyReqBplus;
      this.availableStockTotal = Math.round(((this.branchData.stockedOplus + this.branchData.stockedOminus) * 0.6
              + (this.branchData.stockedAplus + this.branchData.stockedBplus) * 0.2) /
              ((this.branchData.dailyReqOplus + this.branchData.dailyReqOminus) * 0.6
              + (this.branchData.dailyReqAplus + this.branchData.dailyReqBplus) * 0.2));
    }
    this.barChartData = [
        {data: [this.plusO] , label: 'O+'},
        {data: [this.minusO], label: 'O-'},
        {data: [this.plusA], label: 'A+'},
        {data: [this.plusB], label: 'B+'},
        {data: [this.availableStockTotal], label: 'total'},
        // {data: [this.selfImage], label: 'selfImage'},
        // {data: [temp], label: 'Total'}
      ];
    if (this.branchData !== null) {
        this.showItems = true;
      } else {
        this.showItems = false;
      }
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
  getBranchInfo(value) {
    console.log(value);
    this.dashService.getBranchInfo(value).subscribe(
      result => {
        console.log(result);
        this.branchesInfo = result;
    },
    error => {
      console.log(error.error);
    });
  }

  getBranchDailyRequirements() {
    this.dataManService.getNoDaysRequiremets().subscribe(
      result => {
        this.noDaysRequiremets = result;
        if (this.noDaysRequiremets !== null ) {
          this.plusO = this.noDaysRequiremets.harareOplus / this.stockedOplus;
          console.log(this.plusO);
          console.log(this.stockedOplus);
          console.log(this.noDaysRequiremets.harareOplus);


          this.minusO = this.noDaysRequiremets.harareOminus / this.stockedOminus ;

          this.plusA =  this.noDaysRequiremets.harareAplus / this.stockedAplus;

          this.plusB =  this.noDaysRequiremets.harareBplus / this.stockedBplus;
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
