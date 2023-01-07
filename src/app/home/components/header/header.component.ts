import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(public popoverController: PopoverController, private authService: AuthService) { }

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
      this.userFullImagePath = fullIamgePath;
    });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  async presentPopover(ev:any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
      //translucent: true
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    
  }

}
