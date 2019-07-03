import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKey } from './../../../util/key';

@Component({
  selector: 'app-base-admin',
  templateUrl: './base-admin.component.html',
  styleUrls: ['./base-admin.component.css']
})
export class BaseAdminComponent implements OnInit {

  rol: string[];
  constructor(public router: Router) {
    this.rol = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
  //   if (!this.rol.includes('ROLE_GLOBAL')) {
  //   if (!this.rol.includes('ROLE_SUPER_ADMIN')) {
  //     if (!this.rol.includes('ROLE_MANAGER')) {
  //       if (! this.rol.includes('ROLE_FINANCE')) {
  //         this.router.navigate(['/access-denied']);
  //       }

  //     }
  //   }
  // }
  }
  ngOnInit(): void {
  }
}
