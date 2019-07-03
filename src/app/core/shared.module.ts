import { NgModule } from '@angular/core';
import { BaseFormComponent } from '../layout/base-form/base-form.component';
import { MatFormFieldModule, MatGridListModule } from '@angular/material';


@NgModule({
  declarations: [
    BaseFormComponent,

  ],
  imports: [
    MatFormFieldModule,
    MatGridListModule,
  ],
  exports: [
    BaseFormComponent,
  ],
  providers: [

  ],
})
export class SharedModule { }
