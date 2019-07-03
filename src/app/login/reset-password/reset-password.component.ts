import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { ParentErrorStateMatcher, PasswordValidator } from 'src/app/validators/password.validator';
import { Messages } from 'src/app/util/messages';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from 'src/app/global';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  theme = localStorage.getItem('COLOR');
  token: string;
  resetPassForm: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  constructor(private fb: FormBuilder, private authService: AuthService,
    public msg: Messages,
    public global: Global,
    private router: Router,
    public snackBar: MatSnackBar,
    private activatedRouter: ActivatedRoute) {
      this.token = this.activatedRouter.snapshot.params['token'];
     }

  ngOnInit() {
    this.createForm();
    this.matching_passwords_group.get('password').valueChanges.subscribe(data => {
      this.resetPassForm.controls['password'].setValue(data);
    });
  }
  submit(value) {
    this.authService.saveNewPassword(this.token, value.password).subscribe(
      result => {
        this.snackBar.open(result.message, '', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error => {
        this.snackBar.open(error, '', {
          duration: 3000,
        });
        console.log(error);
      }
    );
  }
  createForm() {
    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(5),
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'
            )
          ])
        ),
        confirmPassword: new FormControl('', Validators.required)
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      }
    );
    this.resetPassForm = this.fb.group({
      password: new FormControl(''),
      matching_passwords: this.matching_passwords_group,
    });
  }

}
