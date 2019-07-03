import {NgModule, Component} from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatCheckboxModule, MatMenuModule, MatToolbarModule, MatFormFieldModule, MatTabsModule,
   MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatSelectModule, MatIconModule
} from '@angular/material';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule,
             MatDialogModule, MatTableModule, MatFormFieldModule, MatTabsModule, MatPaginatorModule,
             MatSortModule, MatProgressSpinnerModule, MatCheckboxModule, MatMenuModule, MatSelectModule,
              MatIconModule
            ],
  exports: [
              CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule,
              MatTableModule, MatFormFieldModule, MatTabsModule, MatPaginatorModule, MatSortModule,
              MatProgressSpinnerModule, MatCheckboxModule, MatMenuModule, MatSelectModule, MatIconModule
          ],
})
export class CustomMaterialModule { }
