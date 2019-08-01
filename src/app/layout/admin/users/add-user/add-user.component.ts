import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {FormArray, FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {PasswordValidator, ParentErrorStateMatcher} from 'src/app/validators/password.validator';
import { Messages } from 'src/app/util/messages';
import { UserRole } from 'src/app/shared/config/model/admin/user-role';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/config/model/admin/user.model';
import { Gender } from 'src/app/shared/enums/gender';
import { UserService } from 'src/app/shared/config/service/admin/user.service';
import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';
import { Router } from '@angular/router';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { SnotifyService } from 'ng-snotify';
import { DateUtil } from 'src/app/util/date-util';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/util/app-date-adapter';
import { PhysicianType } from 'src/app/shared/enums/physician-type';
import { Title } from 'src/app/shared/enums/title.enum';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { BranchService } from '../../../../shared/config/service/admin/branch.service';

@Component({
  selector: 'app-add-user',
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class AddUserComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription: Subscription;
  matching_passwords_group: FormGroup;
  userDetailsForm: FormGroup;
  physicianGroup: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  roles: UserRole[] = [];
  branches: Branch[] = [];
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  selected: number[] = [];

  isGeneral  = true;
  isDoc = false;

  // user: User;
  userToEdit: User;
  physicianType = PhysicianType;
  physicianTypeKeys: any[];
  title = Title;
  titleName = '';
  titleKeys: any[];
  isDoctorAccount = false;
  maxDate = new Date();
  gender = Gender;
  genderKeys: any[];
  serverError: any;
  util;
  idFormat = '^[0-9]{2}-[0-9]{6,7}[A-Z]{1}[0-9]{2}$';
  changePass = false;
  // company = JSON.parse(sessionStorage.getItem(StorageKey.COMPANY_DETAIL));
  constructor(
    public userService: UserService,
    private roleService: UserRoleService,
    public dialog: MatDialog,
    private snotify: SnotifyService,
    private fb: FormBuilder,
    public msg: Messages,
    private router: Router,
    private branchService: BranchService
  ) {
    // this.genderKeys = Object.keys(this.gender).filter(Number);
    // this.physicianTypeKeys = Object.keys(this.physicianType).filter(Number);
    // this.titleKeys = Object.keys(this.title).filter(Number);
  }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.createForm();
    this.fetchUserToEdit();
    this.fetchBranches();
  }
  ngAfterViewInit() {
    this.matching_passwords_group.get('password').valueChanges.subscribe(data => {
      this.userDetailsForm.controls['password'].setValue(data);
    });
    // this.userDetailsForm.get('physician').disable();
  // this.userDetailsForm.controls['physician'].setValue(null);
  }

  fetchUserToEdit() {
    this.userService.getUser().subscribe(
      user => {
        console.log(user);
        this.userToEdit = user;
        if (user !== undefined) {
          if (this.userToEdit.id !== undefined) {
            this.changePass = true;
            this.fetchEditRoles(this.userToEdit.id);
            this.populateForm();
          } else {
            this.fetchUserRoles();
          }
        } else {
          this.fetchUserRoles();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // accountType(value: boolean) {
  //    this.isDoctorAccount = value;
  //    if (value) {
  //      this.userDetailsForm.get('physician').enable(); // Enable physician account for the user
  //    } else {
  //      this.userDetailsForm.get('physician').disable();
  //    }
  //    this.preSelectRoleDoctor(value);
  // }

  // preSelectRoleDoctor(value: boolean) {
  //   this.roles.forEach(r => {
  //     if (r.name === 'ROLE_DOCTOR') {
  //      const userroles = (<FormArray>(
  //        this.userDetailsForm.get('userRoles')
  //      )) as FormArray;
  //      if (value) {
  //       r.selected = true;
  //       userroles.push(new FormControl(r));
  //      } else {
  //       const i = userroles.controls.findIndex(
  //         x => x.value.id === r.id
  //       );
  //       userroles.removeAt(i);
  //       r.selected = false;
  //       this.roles = this.roles.filter(t => t.id !== r.id);
  //       this.roles.push(r);
  //      }
  //     }
  //  });
  // }
  populateForm() {
    this.userDetailsForm.get('id').setValue(this.userToEdit.id);
    this.userDetailsForm.get('version').setValue(this.userToEdit.version);
    this.userDetailsForm.get('dateCreated').setValue(this.userToEdit.dateCreated);
    this.userDetailsForm.get('createdById').setValue(this.userToEdit.createdById);
    this.userDetailsForm.controls['firstName'].setValue(this.userToEdit.firstName);
    this.userDetailsForm.controls['middleName'].setValue(this.userToEdit.middleName);
    this.userDetailsForm.controls['lastName'].setValue(this.userToEdit.lastName);
    // this.userDetailsForm.controls['dateOfBirth'].setValue(new Date(this.userToEdit.dob));
    this.userDetailsForm.controls['userName'].setValue(this.userToEdit.userName);
    // this.userDetailsForm.controls['gender'].setValue(this.userToEdit.gender);
    this.userDetailsForm.controls['branch'].setValue(this.userToEdit.branch);
    console.log(this.userToEdit.branch);
    // this.userDetailsForm.controls['phoneHome'].patchValue(
    //   this.userToEdit.phoneHome
    // );
    const age = DateUtil.getYearsBetween(new Date(), new Date(this.userToEdit.dob));
    // this.userDetailsForm.controls['age'].patchValue(age);
    this.userDetailsForm.controls['phoneCell'].patchValue(
      this.userToEdit.phoneCell
    );
    this.userDetailsForm.controls['phoneBusiness'].patchValue(
      this.userToEdit.phoneBusiness
    );
    // this.userDetailsForm.controls['address'].patchValue(
    //   this.userToEdit.address
    // );
    // this.userDetailsForm.controls['country'].patchValue(
    //   this.userToEdit.country
    // );

    this.userToEdit.userRoles.forEach(userRole => {
      const userroles = (<FormArray>(
        this.userDetailsForm.get('userRoles')
      )) as FormArray;
      userroles.push(new FormControl(userRole));
    });

    this.userDetailsForm.controls['password'].disable();
    this.matching_passwords_group.controls['password'].disable();
    this.matching_passwords_group.controls['confirmPassword'].disable();
  }

  fetchBranches() {
  this.branchService.getAll().subscribe(
    result => {
    this.branches = result;
      },
      error => {
        console.log(error);
      });
  }

  fetchUserRoles() {
    this.roleService.getAll().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.log(error);
      },
      () => {
        this.roles = this.roles.filter(r => r.name !== "ROLE_GLOBAL");
      }
    );
  }
  fetchEditRoles(userId: number) {
    this.roleService.getUserRoles(userId).subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.log(error);
      }
    );
  }
  /* onChange(role: UserRole, index: number, isChecked: boolean) {
    const userroles = <FormArray>this.userDetailsForm.controls.userRoles;
    if (isChecked) {
      userroles.push(new FormControl(role));
    } else {
      userroles.removeAt(index);
    }
  }*/

  onChange(event) {
    const userroles = (<FormArray>(
      this.userDetailsForm.get('userRoles')
    )) as FormArray;
    if (event.checked) {
      userroles.push(new FormControl(event.source.value));
    } else {
      const i = userroles.controls.findIndex(
        x => x.value.id === event.source.value.id
      );
      userroles.removeAt(i);
    }
  }

  createForm() {
    // matching passwords validation
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
    // const controls = this.roles.map(r => new FormControl(false));
    this.userDetailsForm = this.fb.group({
      id: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branch: new FormControl(),
      firstName: new FormControl(
        '',
        Validators.compose([
          //  UsernameValidator.validUsername,
          Validators.maxLength(25),
          Validators.minLength(2),
         // Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'),
          Validators.required
        ])
      ),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.compose([
          //   UsernameValidator.validUsername,
          Validators.maxLength(25),
          Validators.minLength(2),
        //  Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'),
          Validators.required
        ])
      ),
      userName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      // facility: new FormControl(''),
      // dateOfBirth: new FormControl(),
      // age: new FormControl(''),
      // gender: new FormControl(''),
      phoneCell: new FormControl(''),
      // phoneHome: new FormControl(''),
      phoneBusiness: new FormControl(''),
      // country: new FormControl(''),
      // address: new FormControl(''),
/*      nationalId: new FormControl('',
      Validators.compose([
        Validators.pattern(this.idFormat)
      ])),*/
      password: new FormControl(''),
      matching_passwords: this.matching_passwords_group,
      userRoles: this.fb.array([], DateUtil.minLength(1))
    });
  }

  selectedTitle(value){
   this.userDetailsForm.get('physician.title').setValue(value);
  }

  onSubmitUserDetails(value) {
    console.log(value);
  //   if(value.dateOfBirth !== null){
  //     const dob = new Date(value.dateOfBirth);
  //     dob.setMinutes(dob.getTimezoneOffset() * -1);
  //     value.dateOfBirth = dob;
  // }
    this.userService.saveUser(value).subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        this.router.navigate(['/admin/user/list']);
      },
      error => {
        const errorObject = error.error;
        if (error.status === 400) {
          this.serverError = errorObject;
        }
        this.snotify.error(
          errorObject.message,
          'Error',
          this.util.getNotifyConfig()
        );
      }
    );
  }
  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '36%',
      data: this.userToEdit
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.userDetailsForm.get('version').setValue(result.data.version);
      }
    });
    dialogRef.updatePosition({ top: '80px', right: '10px'});
  }
  ngOnDestroy(): void {
    this.userService.clearUser();
    // this.cdr.detach();
  }
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }
}
