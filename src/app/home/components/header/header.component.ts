import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { FriendRequest } from '../../models/FriendRequest.model';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequestPopoverComponent } from './friend-request-popover/friend-request-popover.component';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    public popoverController: PopoverController,
    public connectionProfileService: ConnectionProfileService,
    private authService: AuthService,
  ) { }

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  //friendRequests: FriendRequest[];
  private friendRequestsSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
      this.userFullImagePath = fullIamgePath;
    });

    this.friendRequestsSubscription = this.connectionProfileService.getFriendRequest().subscribe(
      (friendRequests: FriendRequest[]) => {
        this.connectionProfileService.friendRequests = friendRequests.filter(freq => freq.status === 'pending');
      }
    )
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
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

  async presentFriendRequestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestPopoverComponent,
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
