import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the SignUp page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUp {
  signupData = {
    email: '',
    password: '',
    passwordRetyped: ''
  };  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {}

  signup() {
    if(this.signupData.password !== this.signupData.passwordRetyped) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Your password and your re-entered password does not match each other.',
	      buttons: ['OK']
      });
      alert.present();
      return;
    }
    // Firebase Signup Code
    this.afAuth.auth.createUserWithEmailAndPassword(this.signupData.email, this.signupData.password)
      .then( auth => {
        console.log(auth);
      })
      .catch( err => {
        let alert = this.alertCtrl.create({
              title: 'Error',
              message: err.message,
              buttons: ['OK']
            });
        alert.present();      

         console.log(err);
      });
  }  

}
