import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule,
   MatCardModule, MatMenuModule, MatDividerModule, MatDialogModule, MatTooltipModule, MatAutocompleteModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatChipsModule } from '@angular/material';
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
@NgModule({
  declarations: [
    MainComponent,
    SideNavComponent,
    DashboardComponent,
    ChangePasswordDialogComponent, StockAvailableComponent, StockQuarantinedComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatInputModule, MatOptionModule, MatSelectModule,
    AccessDeniedSharedModule, MatExpansionModule,
    LayoutRoutingModule, FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule, MatDividerModule,
    MatMenuModule,
    MatDialogModule, MatTooltipModule,
    NgxDatatableModule, MatChipsModule
  ],
  entryComponents: [ChangePasswordDialogComponent],
  providers: []
})
export class LayoutMainModule { }

