import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { CreateBill } from '../create-bill/create-bill';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Geolocation } from '@ionic-native/geolocation';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  items: FirebaseListObservable<any[]>;
  songs: FirebaseListObservable<any>;
  billList: FirebaseListObservable<any>;

  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public actionSheetCtrl: ActionSheetController,
    afDB: AngularFireDatabase,
    private auth: AngularFireAuth,
    private googleMaps: GoogleMaps,
    public geolocation: Geolocation
  ) 
  {
    this.items = afDB.list('/cuisines');
    this.songs = afDB.list('/songs');
    this.billList = afDB.list('/bills');
  }

  ionViewDidLoad() {
    if (this.platform.is('core') || this.platform.is('mobileweb'))
      this.loadMapBrowser();
    else
      this.loadMapMobile();
  }

  loadMapMobile(){
      
    let location = new LatLng(-34.9290,138.6010);

    this.map = new GoogleMap('map');    

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
    });

  }
  
  loadMapBrowser() {
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //initiate the marker
      this.addMarker();
 
    }, (err) => {
      console.log(err);
        let alert = this.alertCtrl.create({
              title: 'Error',
              message: err.message,
              buttons: ['OK']
            });
        alert.present();       
    });
 
  }
  
  addMarker(){
  
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  
    let content = "<h4>Pick-up Point</h4>";          
  
    this.addInfoWindow(marker, content);
  
  }  

  addInfoWindow(marker, content){
  
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  
  }  

  addSong() {
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push({
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }  

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  } 
  
  removeSong(songId: string){
    this.songs.remove(songId);
  }  

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }  

  newBill(){
    this.navCtrl.push(CreateBill);
  }  

  logout() {
    this.auth.auth.signOut();
  }  
}
