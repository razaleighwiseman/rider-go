import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateBill } from '../pages/create-bill/create-bill';
import { Login } from '../pages/login/login';
import { SignUp } from '../pages/sign-up/sign-up';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';

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
    SignUp
  ],
  imports: [
    BrowserModule,
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
    SignUp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook
  ]
})
export class AppModule {}
