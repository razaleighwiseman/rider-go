import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SignUp } from '../sign-up/sign-up';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  }  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private fb: Facebook, 
    private platform: Platform
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
  
  signup() {
    this.navCtrl.push(SignUp, { email: this.loginData.email });
  }  

  signInWithFacebook() {
  /*this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));*/

    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }      
  }  

}
