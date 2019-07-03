import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { transitionAnimation } from '../animations/shared-animate';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../core/auth.service';
import { TokenStorage } from '../core/token.storage';
import { Global } from '../global';
import { StorageKey } from '../util/key';
import { UserRoleService } from '../shared/config/service/admin/user-role.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('animate', transitionAnimation)
]
})
export class LoginComponent implements OnInit {

  password: string;
  userName: string;
  hide = true;
  theme: string;
  branchId = localStorage.getItem(StorageKey.BRANCH_ID);
  roles: string[];

  constructor(private router: Router, public global: Global,
              private authService: AuthService, private token: TokenStorage,
              private roleService: UserRoleService,
  ) {
  }


  ngOnInit() {
    localStorage.removeItem('AuthToken');
    sessionStorage.removeItem(StorageKey.BRANCH_DETAIL);
    localStorage.removeItem(StorageKey.BRANCH_ID);
    localStorage.removeItem(StorageKey.USER);
    sessionStorage.removeItem(StorageKey.GRANTED_AUTHORITIES);
    this.theme = localStorage.getItem('COLOR');
  }

  login(): void {
    this.authService.attemptAuth(this.userName, this.password).subscribe(
      data => {
        this.token.saveToken(data.token);
        if (data.user !== null) {
            if ( data.user.branch !== null ) {
                sessionStorage.setItem(StorageKey.BRANCH_DETAIL, JSON.stringify(data.user.branch));
                localStorage.setItem(StorageKey.BRANCH_ID, data.user.branch.id);
                localStorage.setItem(StorageKey.BRANCH_NAME, data.user.branch.branchName);
            }
            localStorage.setItem(StorageKey.USER, JSON.stringify(data));
        }
      },
       error => {
      },
      () => {
        this.getRoles();
        // this.router.navigate(['dashboard']).then(() => {
        //   window.location.reload();
        // });
        this.getUser();
       }
    );
  }
  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  getRoles() {
    this.roleService.getGrantedAuthorities().subscribe(
      result => {
        const allRoles = JSON.stringify(result);
        sessionStorage.setItem(StorageKey.GRANTED_AUTHORITIES, allRoles);
        console.log(allRoles);
      },
      error => {
        console.log(error);
      },
      () => {
        this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
        if (this.roles.includes('ROLE_DOCTOR')) {
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        } else if (this.roles.includes('ROLE_USER')) {
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        } else {
        this.router.navigate(['dashboard']).then(() => {
          window.location.reload();
        });
      }
      }
    );
  }

  getUser() {
    return this.authService.getUser().subscribe(
      data => localStorage.setItem(StorageKey.USER, JSON.stringify(data))
    );
  }

}
