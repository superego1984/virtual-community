import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ILeisurePark , IUILeisurePark } from '../../model/leisurePark';
import { IUser } from '../../model/user';
import { AppSettings } from '../../settings/app-settings';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the LookupLeisureParkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lookup-leisure-park',
  templateUrl: 'lookup-leisure-park.html',
})
export class LookupLeisureParkPage {

  sharedLeisureParks : IUILeisurePark[];
  currentUser: IUser;
  inputComId: string;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiService: RestServiceProvider) {
      this.inputComId = navParams.get('comId');
  }

  ionViewDidLoad() {
    this.currentUser = AppSettings.getCurrentUser(); 
    console.log('ionViewDidLoad LookupLeisureParkPage');
    this.getLeisureParkbyCommunity();
  }

  apply(lpId){
    console.log('lpId: ' + lpId);
    const updateBody = {
      status : 'applied'
    };
    this.apiService.updateleisurePark(lpId,updateBody).then(lp => {
      if(lp){
        console.log(lp);
      }
    });
  }

  getLeisureParkbyCommunity() {
    if(!this.inputComId){
      this.inputComId = this.navParams.get('comId');
    }
    this.apiService.getLeisureParkbyCommunity(this.inputComId, this.currentUser._id).then((lpark: any) => {
      if (lpark && lpark.length>0) {
        this.sharedLeisureParks = lpark;
        this.sharedLeisureParks.forEach(x => {
          //x.startTime = new Date(x.startTime.toLocaleString("MM-DD-YYYY HH:mm"));
          //status is an array
          if (x.status && x.status.length === 1) {
            if (x.status[0] === 'active') {
              x.statusDisplayText = '可申请';
            } else if (x.status[0] === 'pending') {
              x.statusDisplayText = '待审核';
            } else if (x.status[0] === 'applied') {
              x.statusDisplayText = '已申请';
            } else {
              x.statusDisplayText = '已失效';
            }
          }
        }) 
      }
    });
  }  
  
}