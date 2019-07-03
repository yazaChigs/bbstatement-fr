import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Global } from 'src/app/global';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  theme = localStorage.getItem('COLOR');
  overlay = '';

  forgotPassForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService,
    public global: Global,
    private router: Router,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.createForm();
  }
  submit(value) {
    this.overlay = 'div-overlay';
    this.authService.sendForgotEmail(value.email).subscribe(
      result => {
        this.snackBar.open(result.message, '', {
          duration: 4000,
        });
        this.overlay = '';
         this.router.navigate(['/login']);
      },
      error => {
        console.log( error.error.errorMessage);
        this.snackBar.open(error.error.errorMessage, '', {
          duration: 15000,
        });
        this.overlay = '';
        this.router.navigate(['/login']);
      }
    );
  }
  createForm() {
    this.forgotPassForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ]))
    });
  }
}
