import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidator, ParentErrorStateMatcher } from 'src/app/validators/password.validator';
import { Messages } from 'src/app/util/messages';
import { UserService } from 'src/app/shared/config/service/admin/user.service';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {

  public theme = localStorage.getItem('COLOR');
  form: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  util;
  constructor(@Inject(MAT_DIALOG_DATA) public user: any, private fb: FormBuilder, public msg: Messages,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userService: UserService, private snotify: SnotifyService) { }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.createForm();
    this.matching_passwords_group.get('password').valueChanges.subscribe(data => {
      this.form.controls['password'].setValue(data);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
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
    this.form = this.fb.group({
      password: new FormControl(''),
      matching_passwords: this.matching_passwords_group,
    });
  }

  save(value) {
    this.userService.changePassword(this.user.id, value.password).subscribe(
      result => {
        this.dialogRef.close({
          data: result.user
        });
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        console.log(error.message);
      }
    );
  }

}
