import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignUp } from '../sign-up/sign-up';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  login() {
    // Login Code here
  }
  
  signup() {
    this.navCtrl.push(SignUp, { email: this.loginData.email });
  }  

}
