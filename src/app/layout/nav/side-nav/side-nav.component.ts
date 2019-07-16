import { Global } from './../../../global';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog , MatDialogRef} from '@angular/material';
import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';
import { StorageKey } from 'src/app/util/key';
import { FormControl } from '@angular/forms';

import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from 'src/app/core/auth.service';
import { ChangePasswordDialogComponent } from '../../admin/users/change-password-dialog/change-password-dialog.component';
import { User } from 'src/app/shared/config/model/admin/user.model';
import { Router } from '@angular/router';
import { StaticDataService } from 'src/app/shared/config/service/static.data.service';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { BranchService } from '../../../shared/config/service/admin/branch.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  public theme = 'mat_red';
  opened: false;
  showBranches = false;
  branchName = 'Branch';
  branchId = localStorage.getItem(StorageKey.BRANCH_ID);
  branch = JSON.parse(sessionStorage.getItem(StorageKey.BRANCH_DETAIL));
  roles: string[];
  user: User;
  disableSyncBtn = false;
  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Branch[]>;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public global: Global,
    public staticData: StaticDataService,
    private router: Router,
    private permissionService: NgxPermissionsService,
    private branchService: BranchService
  ) {
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    this.user = JSON.parse(localStorage.getItem(StorageKey.USER));
  }


  ngOnInit(): void {
    // this.getModules();
    this.getRoles();
    this.permissionService.loadPermissions(this.roles);
    if ( this.branch !== null) {
         this.branchName = this.branch.name;
         this.theme = 'mat_red';
         if ( this.theme === null) {
           this.theme = 'mat_red';
         }
         localStorage.setItem('COLOR', this.theme);
    }
  }

  sync() {
  //  this.disableSyncBtn = true;
  //  this.staticData.getStaticData().subscribe(
  //    result => {
  //    }
  //  );
  location.reload();
  }

  getRoles() {
    if (this.roles.includes('ROLE_GLOBAL')) {
      this.showBranches = true;
      this.getBranches();
  }
  }

  getBranches() {
    this.branchService.getAll().subscribe(result => {
      this.branch = result;
    },
    error => {
      console.log(error);
    },
    () => {
      this.filteredOptions = this.myControl.valueChanges
    .pipe( startWith<string | Branch>(''),
    map(value => typeof value === 'string' ? value : value === null ? '' : value.branchName),
    map(name => name ? this._filter(name) : this.branch.slice())
    );
    }
    );
  }

  // getModules() {
  //   this.service.getUserModules().subscribe(
  //     result => {
  //       this.list = result;
  //   },
  //   error => console.log(error.error),
  //   () => {
  //     this.list.forEach(item => {
  //       if ((item.title !== 'Adminstration') && (item.title !== 'Test Results') && (item.title !== 'Reports')) {
  //         this.modules.push(item);
  //       }
  //     });
  //   }

  //   );
  // }
  private _filter(value: string): Branch[] {
    const filterValue = value.toLowerCase();
    return this.branch.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  selectItem(item) {
    this.branchName = item.name;
    sessionStorage.setItem(StorageKey.BRANCH_DETAIL, JSON.stringify(item));
    localStorage.setItem(StorageKey.BRANCH_ID, item.id);
    localStorage.setItem('COLOR', item.templateColor);
    this.branchId = item.id;
    window.location.reload();

  }
  displayFn(t?: Branch): string | undefined {
    return t ? t.branchName : undefined;
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '36%',
      data: this.user
    });
    dialogRef.updatePosition({ top: '80px', right: '10px'});
  }
  logout(){
    sessionStorage.removeItem(StorageKey.BRANCH_DETAIL);
    localStorage.removeItem(StorageKey.BRANCH_ID);
    localStorage.removeItem(StorageKey.USER);
    sessionStorage.removeItem(StorageKey.GRANTED_AUTHORITIES);
    this.router.navigate(['/login']);
  }
}
