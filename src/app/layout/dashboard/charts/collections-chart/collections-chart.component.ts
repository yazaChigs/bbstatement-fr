import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-collections-chart',
  templateUrl: './collections-chart.component.html',
  styleUrls: ['./collections-chart.component.css']
})
export class CollectionsChartComponent implements OnInit, OnChanges {

  collectionsHarare = 0;
  collectionsBulawayo = 0;
  collectionsGweru = 0;
  collectionsMutare = 0;
  collectionsMasvingo = 0;
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
    {data: [this.collectionsHarare] , label: 'Harare'},
    {data: [this.collectionsBulawayo], label: 'Bulawayo'},
    {data: [this.collectionsGweru], label: 'Gweru'},
    {data: [this.collectionsMutare], label: 'Mutare'},
    {data: [this.collectionsMasvingo], label: 'Masvingo'},
  ];

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.fillChart(this.branchData);
  }
  fillChart(branchData: any) {
    if (branchData !== null ) {
      this.collectionsHarare = this.branchData.collectionsHarare;
      this.collectionsBulawayo = this.branchData.collectionsBulawayo;
      this.collectionsGweru =  this.branchData.collectionsGweru;
      this.collectionsMutare =  this.branchData.collectionsMutare;
      this.collectionsMasvingo =  this.branchData.collectionsMasvingo;
    }
    this.barChartData = [
        {data: [this.collectionsHarare] , label: 'Harare'},
        {data: [this.collectionsBulawayo], label: 'Bulawayo'},
        {data: [this.collectionsGweru], label: 'Gweru'},
        {data: [this.collectionsMutare], label: 'Mutare'},
        {data: [this.collectionsMasvingo], label: 'Masvingo'},
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
