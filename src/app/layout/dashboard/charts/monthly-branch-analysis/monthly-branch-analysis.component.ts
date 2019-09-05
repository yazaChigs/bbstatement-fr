import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';

@Component({
  selector: 'app-monthly-branch-analysis',
  templateUrl: './monthly-branch-analysis.component.html',
  styleUrls: ['./monthly-branch-analysis.component.css']
})
export class MonthlyBranchAnalysisComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        fillColor: 'green',
      }
    }
  };
  public barChartLabels: Label[] = ['Harare', 'Bulawayo', 'Gweru', 'Mutare', 'Masvingo'];
  // public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55], backgroundColor: 'green', label: 'Green' },
    { data: [25, 26, 16, 19, 10, 40], backgroundColor: 'orange', label: 'Orange' },
    { data: [10, 15, 4, 0, 34, 15], backgroundColor: 'red', label: 'Red' }
  ];

  constructor(public service: DashboardService) { }

  ngOnInit() {
    this.getReport();
  }

  public getReport() {
    this.service.getReportMonthly().subscribe(
      data => {
        this.barChartData = [];
        const lables = [];
        data.forEach(item => {
          lables.push(item.row[0]);
          const name = item.row[0];
          item.row.splice(0, 1);
          const current = item.row;
          const record = { data: current,  label: name, backgroundColor: name };
          this.barChartData.push(record);
        });
      },
      error => console.log(error.error)
    );

}
}
