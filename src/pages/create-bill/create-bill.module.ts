import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateBill } from './create-bill';

@NgModule({
  declarations: [
    CreateBill,
  ],
  imports: [
    IonicPageModule.forChild(CreateBill),
  ],
  exports: [
    CreateBill
  ]
})
export class CreateBillModule {}
