import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';

import { AngularFireAuth } from 'angularfire2/auth';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;  
  
  loggedInPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: HomePage, icon: 'home' }
  ];  
  rootPage:any = HomePage;
  user = {displayName: null, email: null, photoURL: null};
  displayName;

  constructor(
    platform: Platform, 
    public menu: MenuController,
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if(!auth) {
        this.rootPage = Login;
        this.menu.enable(false);
      }
      else {
        this.rootPage = HomePage;
        this.menu.enable(true);
        //set profile attributes
        this.user.displayName = auth.displayName;
        this.user.email = auth.email;
        this.user.photoURL = auth.photoURL;     
      }
    });    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page: PageInterface) {
    this.nav.setRoot(page.name).catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });    
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }    
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

