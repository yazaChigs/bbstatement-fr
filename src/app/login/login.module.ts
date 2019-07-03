import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule,
  MatIconModule, MatToolbarModule, MatDividerModule, MatSnackBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
        LoginRoutingModule,
        CommonModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        FlexLayoutModule,
        MatCardModule,
      MatIconModule,
      MatToolbarModule,
        MatDividerModule,
        FormsModule, ReactiveFormsModule, MatSnackBarModule
    ],
    declarations: [LoginComponent, ForgotPasswordComponent, ResetPasswordComponent]
})
export class LoginModule {}
