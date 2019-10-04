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
  // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartLabels: Label[] = ['O', 'A', 'B'];
  public pieChartData: number[] = [40, 20, 20];
  // public pieChartData = [
  //   {data: [this.Olable] , label: 'O'},
  //   {data: [this.Alable], label: 'A'},
  //   {data: [this.Blable], label: 'B'},
  // ]
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
    if (this.branchData !== null ) {

    }

    // this.pieChartData = [
    //   this.Olable,
    //   this.Olable,
    //   this.Blable
    //   ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.Olable = 45;
      this.Alable = 88;
      this.Blable =  22;
  }
}
