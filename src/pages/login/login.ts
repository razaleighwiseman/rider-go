import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { EmailLoginPage } from '../email-login/email-login';
import { SignUp } from '../sign-up/sign-up';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private fb: Facebook, 
    private googlePlus: GooglePlus,
    private platform: Platform
  ) {}

  emailLogin() {
    this.navCtrl.push(EmailLoginPage);
  }
  
  signup() {
    this.navCtrl.push(SignUp);
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
  
  signInWithGoogle() {
    if (this.platform.is('cordova')) {
      return this.googlePlus.login({
        'webClientId': '222107218201-sehibnd5ov2ohu8akj5hdo85653886jd.apps.googleusercontent.com'
      }).then( 
        res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          return firebase.auth().signInWithCredential(googleCredential);
        }).catch (
          err => this.showToast(err)
        )  
    }
      else {
        return this.afAuth.auth
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(res => console.log(res));
      }

  } 

  showToast(msg) {
    let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000
          });
    toast.present();    
  }

}
