import { NgModule } from '@angular/core';
import {
  MatFormFieldModule, MatGridListModule, MatToolbarModule, MatButtonModule, MatIconModule,
  MatCardModule, MatDividerModule, MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule,
  MatStepperModule, MatDatepickerModule, MatNativeDateModule, MatExpansionModule, MatTooltipModule, MatAutocompleteModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, FlexLayoutModule,
    MatFormFieldModule, MatGridListModule, MatToolbarModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatCardModule, MatDividerModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTooltipModule,
    NgxDatatableModule,
    MatAutocompleteModule
  ],
  exports: [
  ],
  providers: [

  ]
})
export class PatientSharedModule { }
