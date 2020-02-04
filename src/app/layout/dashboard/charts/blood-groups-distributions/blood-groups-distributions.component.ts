import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-blood-groups-distributions',
  templateUrl: './blood-groups-distributions.component.html',
  styleUrls: ['./blood-groups-distributions.component.css']
})
export class BloodGroupsDistributionsComponent implements OnInit, OnChanges {

  showItems = true;
  Olable = 0;
  Alable = 0;
  Blable = 0;
  @Input() branchData: any = {};
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['O', 'A', 'B'];
  public pieChartData: number[] = [40, 20, 30];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  constructor() { }

  ngOnInit() {
    if (this.branchData !== null ) {
      this.fillChart(this.branchData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.branchData)
    this.fillChart(this.branchData);
  }

  fillChart(branchData: any) {
    if (branchData !== null ) {
      this.Olable = this.branchData.stockedOplus + this.branchData.stockedOplus;
      this.Alable = this.branchData.stockedAplus;
      this.Blable =  this.branchData.stockedBplus;
    }
    this.pieChartData = [this.Olable, this.Alable, this.Blable ];
    if (this.branchData !== null) {
        this.showItems = true;
      } else {
        this.showItems = false;
      }
  }
}
