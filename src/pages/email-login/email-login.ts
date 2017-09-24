import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the EmailLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html',
})
export class EmailLoginPage {
  loginData = {
    email: '',
    password: ''
  }   

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth
  ) {}

  login() {
    // Login Code here
    this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
        .then(auth => {
          // Do custom things with auth
        })
        .catch(err => {
          // Handle error
          let toast = this.toastCtrl.create({
                  message: err.message,
                  duration: 2000
                });
          toast.present();          
        });
  }  

}
