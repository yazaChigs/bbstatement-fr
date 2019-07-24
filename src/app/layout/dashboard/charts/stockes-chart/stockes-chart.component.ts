import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-stockes-chart',
  templateUrl: './stockes-chart.component.html',
  styleUrls: ['./stockes-chart.component.css']
})
export class StockesChartComponent implements OnInit, OnChanges {

  plusO = 0;
  minusO = 0;
  plusA = 0;
  plusB = 0;
  showItems = true;
  branchesInfo: any = {};
  @Input() branchData: any = {};
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
  ];

  constructor() { }

  ngOnInit() {
    this.fillChart(this.branchData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fillChart(this.branchData);
  }

  fillChart(branchData: any) {
    if (branchData !== null ) {
      this.plusO = this.branchData.stockedOplus;
      this.minusO = this.branchData.stockedOminus;
      this.plusA =  this.branchData.stockedAplus;
      this.plusB =  this.branchData.stockedBplus;
    }
    this.barChartData = [
        {data: [this.plusO] , label: 'O+'},
        {data: [this.minusO], label: 'O-'},
        {data: [this.plusA], label: 'A+'},
        {data: [this.plusB], label: 'B+'},
        // {data: [this.selfImage], label: 'selfImage'},
        // {data: [temp], label: 'Total'}
      ];
    if (this.branchData !== null) {
        this.showItems = true;
      } else {
        this.showItems = false;
      }
  }

}
