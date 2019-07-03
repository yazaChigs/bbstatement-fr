import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatDividerModule,
  MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule,
  MatDatepickerModule, MatNativeDateModule, MatTabsModule,
  MAT_DIALOG_DEFAULT_OPTIONS, MatListModule, MatTooltipModule, MatButtonToggleModule } from '@angular/material';
  import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { AddUserComponent } from './add-user/add-user.component';
import { UserRoutingModule } from './user-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListUserComponent } from './list-user/list-user.component';


@NgModule({
  declarations: [
      AddUserComponent, ListUserComponent
  ],
  entryComponents: [],
  imports: [
    UserRoutingModule, FormsModule, CommonModule, SharedModule, MatCheckboxModule, MatTabsModule,
     ReactiveFormsModule, FlexLayoutModule, MatDatepickerModule, MatNativeDateModule,MatButtonToggleModule,
     MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule, MatCardModule,
      MatInputModule, MatOptionModule, MatSelectModule, MatDividerModule, MatDialogModule,
      NgxDatatableModule, MatListModule, MatTooltipModule, HttpClientModule,  NgxPermissionsModule.forChild()
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class UserModule { }
