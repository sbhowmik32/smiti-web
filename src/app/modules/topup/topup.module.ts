import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopupRoutingModule } from './topup-routing.module';
import { TopupComponent } from './pages/topup/topup.component';
import { TopupCreateComponent } from './pages/topup-create/topup-create.component';
import { CrudModule } from '../crud/crud.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TopupComponent,
    TopupCreateComponent
  ],
  imports: [
    CommonModule,
    TopupRoutingModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
  ],
})
export class TopupModule { }
