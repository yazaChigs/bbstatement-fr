import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'app-branch-contributions',
  templateUrl: './branch-contributions.component.html',
  styleUrls: ['./branch-contributions.component.css']
})
export class BranchContributionsComponent implements OnInit, OnChanges {


  showItems = true;
  @Input() branchData: any = {};
  harareContr = 0;
  bulawayoContr = 0;
  gweruContr = 0;
  mutareContr = 0;
  masvingoContr = 0;

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
  // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartLabels: Label[] = ['Harare', 'Bulawayo', 'Gweru', 'Mutare', 'Masvingo'];
  public pieChartData: number[] = [47, 29, 9, 8, 7];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  // public pieChartColors = [
  //   {
  //     backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
  //   },
  // ];
  constructor() { }

  ngOnInit() {
    this.fillChart(this.branchData)
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.fillChart(this.branchData)
  }

  fillChart(branchData: any) {
    if (branchData !== null ) {
      this.harareContr = this.branchData.harareStocks;
      this.bulawayoContr = this.branchData.bulawayoStocks;
      this.gweruContr =  this.branchData.gweruStocks;
      this.mutareContr =  this.branchData.mutareStocks;
      this.masvingoContr =  this.branchData.masvingoStocks;
    }
    this.pieChartData = [this.harareContr,
      this.bulawayoContr,
      this.gweruContr,
      this.mutareContr,
      this.masvingoContr];
    if (this.branchData !== null) {
        this.showItems = true;
      } else {
        this.showItems = false;
      }
  }

}
