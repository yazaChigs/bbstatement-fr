import { BloodGroupsDistributionsComponent } from './dashboard/charts/blood-groups-distributions/blood-groups-distributions.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule,
   MatCardModule, MatMenuModule, MatDividerModule, MatDialogModule, MatTooltipModule, MatAutocompleteModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatBadgeModule } from '@angular/material';
import { SideNavComponent } from './nav/side-nav/side-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LayoutRoutingModule } from './layout-routing.module';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AccessDeniedSharedModule } from '../core/access-denied.shared.module';
import { ChangePasswordDialogComponent } from './admin/users/change-password-dialog/change-password-dialog.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { StockAvailableComponent } from './stock-available/stock-available.component';
import { StockQuarantinedComponent } from './stock-quarantined/stock-quarantined.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { BloodGroupDaysSupplyComponent } from './dashboard/charts/BloodGroup-DaysSupply/BloodGroup-DaysSupply.component';
import { ChartsModule } from 'ng2-charts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BranchContributionsComponent } from './dashboard/charts/branch-contributions/branch-contributions.component';
import { DeemandVsSupplyComponent } from './dashboard/charts/deemand-vs-supply/deemand-vs-supply.component';
import { StockesChartComponent } from './dashboard/charts/stockes-chart/stockes-chart.component';
import { CollectionsChartComponent } from './dashboard/charts/collections-chart/collections-chart.component';
import { MonthlyBranchAnalysisComponent } from './dashboard/charts/monthly-branch-analysis/monthly-branch-analysis.component';

@NgModule({
  declarations: [
    MainComponent,
    SideNavComponent, DeemandVsSupplyComponent, StockesChartComponent, CollectionsChartComponent,
    DashboardComponent, BranchContributionsComponent, MonthlyBranchAnalysisComponent, BloodGroupsDistributionsComponent,
    ChangePasswordDialogComponent, StockAvailableComponent, StockQuarantinedComponent, BloodGroupDaysSupplyComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatInputModule, MatOptionModule, MatSelectModule,
    AccessDeniedSharedModule, MatExpansionModule,
    LayoutRoutingModule, FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule, FilterPipeModule,
    MatSidenavModule, MatCheckboxModule,
    MatIconModule, MatDatepickerModule,
    MatListModule, ChartsModule,
    MatGridListModule, MatBadgeModule,
    MatCardModule, MatDividerModule, MatNativeDateModule,
    MatMenuModule,
    MatDialogModule, MatTooltipModule,
    NgxDatatableModule, MatChipsModule
  ],
  entryComponents: [ChangePasswordDialogComponent],
  providers: [MatDatepickerModule]
})
export class LayoutMainModule { }

