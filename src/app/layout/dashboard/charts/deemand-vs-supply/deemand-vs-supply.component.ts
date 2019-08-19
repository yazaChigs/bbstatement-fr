import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';

@Component({
  selector: 'app-deemand-vs-supply',
  templateUrl: './deemand-vs-supply.component.html',
  styleUrls: ['./deemand-vs-supply.component.css']
})
export class DeemandVsSupplyComponent implements OnInit {

  showItems = true;
  public lineChartData: ChartDataSets[] = [
    { data: [10, 20, 30, 40, 50, 60], fill: false, lineTension: 0, label: 'Harare' },
    { data: [10, 20, 30, 40, 50, 60], fill: false, lineTension: 0, label: 'Bulawayo' },
    { data: [10, 20, 30, 40, 50, 60], fill: false, lineTension: 0, label: 'Gweru' },
    { data: [10, 20, 30, 40, 50, 60], fill: false, lineTension: 0, label: 'Mutare' },
    { data: [10, 20, 30, 40, 50, 60], fill: false, lineTension: 0, label: 'Masvingo', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartLegend = true;
  public lineChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.getReport();
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public getReport() {
    this.service.getReport().subscribe(
      data => {
        this.lineChartLabels = data[0].row;
        data.splice(0, 1);
        this.lineChartData = [];
        data.forEach(item => {
          const current = item.row;
          const province = current[0];
          current.splice(0, 1);
          const record = { data: current, fill: false, lineTension: 0, label: province };
          this.lineChartData.push(record);
        });
      },
      error => console.log(error.error)
    );
  }

}
