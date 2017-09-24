import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateBill } from '../pages/create-bill/create-bill';
import { Login } from '../pages/login/login';
import { EmailLoginPage } from '../pages/email-login/email-login';
import { SignUp } from '../pages/sign-up/sign-up';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { Locations } from '../providers/locations';

export const firebaseConfig = {
  apiKey: "AIzaSyCrLyhU7-XPOq3fjNjbh2UR2qg_5SbKzCo",
  authDomain: "go-ride-94168.firebaseapp.com",
  databaseURL: "https://go-ride-94168.firebaseio.com",
  projectId: "go-ride-94168",
  storageBucket: "go-ride-94168.appspot.com",
  messagingSenderId: '974812167429'
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreateBill,
    Login,
    EmailLoginPage,
    SignUp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CreateBill,
    Login,
    EmailLoginPage,
    SignUp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Locations
  ]
})
export class AppModule {}
