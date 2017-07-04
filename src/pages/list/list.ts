import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { ItemDetailsPage } from '../item-details/item-details';

import * as iothub from 'azure-iothub';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(private localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    // for (let i = 1; i < 15; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }

    let registry = iothub.Registry.fromConnectionString('HostName=iot-hub-hendry.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=FE98m4TB4e5J/RzCpgtMV8+WXiXuZeRnBN8WzlaZTJQ=');
    registry.list((err, deviceList) => {
      deviceList.forEach((device, index) => {
        this.items.push({
          title: 'Item ' + index,
          note: device.deviceId,
          icon: this.icons[Math.floor(Math.random() * this.icons.length)]
        });
      });
    });

    setInterval(() => {
      this.items.push({
        title: new Date().toLocaleString(),
        note: 'new',
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }, 5000);
  }

  itemTapped(event, item) {
    this.localNotifications.schedule({
      id: 1,
      title: 'Important Notification!',
      text: `Device [${item.note}] opened`,
      sound: 'file://sound.mp3',
      color: '00FF00',
      led: 'FF0000',
    });
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
