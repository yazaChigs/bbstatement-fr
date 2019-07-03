import { NgModule } from '@angular/core';
import {
  MatCardModule, MatDividerModule, MatToolbarModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {AccessDeniedComponent} from '../layout/access-denied/access-denied.component';


@NgModule({
  declarations: [
    AccessDeniedComponent
  ],
  imports: [ CommonModule, FlexLayoutModule,
    MatToolbarModule,
    MatCardModule, MatDividerModule
  ],
  exports: [
    AccessDeniedComponent
  ],
  providers: [

  ]
})
export class AccessDeniedSharedModule {}
