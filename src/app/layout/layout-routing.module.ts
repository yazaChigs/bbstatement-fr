import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { StockAvailableComponent } from './stock-available/stock-available.component';
import { StockQuarantinedComponent } from './stock-quarantined/stock-quarantined.component';


const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'available', component: StockAvailableComponent },
      { path: 'quarantined', component: StockQuarantinedComponent },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
        // canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['ROLE_GLOBAL', 'ROLE_SUPER_ADMIN', 'ROLE_FINANCE'],
        //   }
        // }
      },
      {
        path: 'access-denied', component: AccessDeniedComponent
      },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
