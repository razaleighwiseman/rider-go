import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the CreateBill page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-create-bill',
  templateUrl: 'create-bill.html',
})
export class CreateBill {
  billList: FirebaseListObservable<any>;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    afDB: AngularFireDatabase) 
    {
      this.billList = afDB.list('/bills');
    }

    createBill(name, amount, dueDate, creatd_at) {
      this.billList.push({
        name: name,
        amount: amount,
        dueDate: dueDate,
        paid: false,
        creatd_at: creatd_at
      }).then ( 
        newBill => {
          this.navCtrl.pop();
        },
        error => {
          console.log(error);
        }
      )
    }
}
