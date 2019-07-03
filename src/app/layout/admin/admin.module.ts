import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatDividerModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatCheckboxModule, MatMenuModule, MatTabsModule, MatDialogModule, MatAutocompleteModule, MatListModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BaseAdminComponent } from './base-admin/base-admin.component';
import { AccessDeniedSharedModule } from 'src/app/core/access-denied.shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ListUserComponent } from './users/list-user/list-user.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { BranchComponent } from './branch/branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';

@NgModule({
  declarations: [ BaseAdminComponent, AdminDashboardComponent, DataManagementComponent, BranchComponent, BranchListComponent
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule, CommonModule, AccessDeniedSharedModule,
    FlexLayoutModule,  FormsModule, ColorPickerModule, MatListModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatDividerModule, MatTabsModule,
    FlexLayoutModule,  FormsModule, FilterPipeModule, NgxDatatableModule, MatAutocompleteModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatDividerModule, MatTabsModule, MatDialogModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatMenuModule, LayoutModule,  NgxPermissionsModule.forChild()
  ],
  entryComponents: [],
  providers: []
})
export class AdminModule { }
