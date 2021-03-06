import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavController, AlertController, ActionSheetController, MenuController } from 'ionic-angular';
import { CreateBill } from '../create-bill/create-bill';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Geolocation } from '@ionic-native/geolocation';

import { Locations } from '../../providers/locations';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker,
 Geocoder, 
 GeocoderRequest
} from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any = [];
  items: FirebaseListObservable<any[]>;
  songs: FirebaseListObservable<any>;
  billList: FirebaseListObservable<any>;

  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public actionSheetCtrl: ActionSheetController,
    public menu: MenuController,
    afDB: AngularFireDatabase,
    private auth: AngularFireAuth,
    private googleMaps: GoogleMaps,
    public geolocation: Geolocation,
    public locations: Locations
  ) 
  {
    this.items = afDB.list('/cuisines');
    this.songs = afDB.list('/songs');
    this.billList = afDB.list('/bills');
  }

  ionViewDidLoad() {
    if (this.platform.is('core') || this.platform.is('mobileweb'))
      this.loadMapBrowser();
    else {
      this.loadMapMobile();
    // handle side menu issue...
      let loginMenu = this.menu.get('loggedInMenu');

      if (loginMenu) {
        loginMenu.ionOpen.subscribe(() => {
          if (this.map) {
            this.map.setClickable(false);
          }
        });

        loginMenu.ionClose.subscribe(() => {
          if (this.map) {
            this.map.setClickable(true);
          }
        });
      }  
    }  
  }

  loadMapMobile(){
      
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {    

      let location = new LatLng(resp.coords.latitude, resp.coords.longitude);

      let position: CameraPosition = {
        target: location,
        zoom: 18,
        tilt: 30
      };     

      this.map = new GoogleMap('map', {
        'mapType': 'MAP_TYPE_NORMAL',
        'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': true,
          'zoom': true
        },
        'gestures': {
          'scroll': true,
          'tilt': true,
          'rotate': true,
          'zoom': true
        },
        'styles': [],
        'camera': position,
        'preferences': {
          'zoom': {
            'minZoom': 0,
            'maxZoom': 25
          },
          'building': false
        }
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
          console.log('Map is ready!');

          this.map.addMarker(markerOptions).then((marker: Marker) => {
            marker.showInfoWindow();
          });

          this.map.addMarker(riderMarker).then((marker: Marker) => {
            marker.showInfoWindow();
          });          
          
      });

      // create new marker
      let markerOptions: MarkerOptions = {
        position: location,
        title: 'Pick-up Point',
        icon: "www/assets/img/marker-point.png",
        draggable: true,
        snippet: "Drag to change pickup point"
      };
      
      let rider: LatLng = new LatLng(3.037216,101.442840);
      
      let riderMarker: MarkerOptions = {
        position: rider,
        title: 'Hadi',
        snippet: "I am a good rider",
        icon: "www/assets/img/motorcycling.png"
        //icon: "https://www.google.com/intl/en_us/mapfiles/ms/icons/motorcycling.png"
      };   

    }).catch((error) => {
      console.log('Error getting location', error);
      let alert = this.alertCtrl.create({
            title: 'Error',
            message: error.message,
            buttons: ['OK']
          });
      alert.present();       
    });
  }
  
  loadMapBrowser() {
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let usersLocation = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude
      };
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,        
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //initiate the marker
      this.addMarker();

      //map riders locations
      this.locations.load(usersLocation).then(
        data => {
          console.log(data);

          let locations = data;

          for(let location of locations){
              this.motorMarker(location);
          }          
        }
      );
 
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
      clickable: true,
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: "assets/img/marker-point.png"
    });
  
    let content = "Pick-up Point";          
  
    this.addInfoWindow(marker, content);
  
  }
  
  motorMarker(location: any): void {
 
    let latLng = new google.maps.LatLng(location.latitude, location.longitude);
 
    let marker = new google.maps.Marker({
      clickable: true,
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: "assets/img/motorcycling.png"
    });
 
    this.markers.push(marker);
    
    let content = '<strong>' + location.title + '</strong><br>' + location.distance +  " km";          
  
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
