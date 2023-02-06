import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/model/user.model';
import { FriendRequest } from 'src/app/home/models/FriendRequest.model';
import { ConnectionProfileService } from '../../../services/connection-profile.service';

@Component({
  selector: 'app-friend-request-popover',
  templateUrl: './friend-request-popover.component.html',
  styleUrls: ['./friend-request-popover.component.scss'],
})
export class FriendRequestPopoverComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    public connectionProfileService: ConnectionProfileService
  ) { }

  ngOnInit() {
    this.connectionProfileService.friendRequests.map(
      (friendRequest) => {
        const img = (friendRequest as any)?.creator?.imagePath || 'blank-profile-picture.png';
        friendRequest['fullImagePath'] = 'http://localhost:3000/api/feed/image/' + img;
      }
    )
  }

  async responseToFriendRequest(id: number, statusResponse: 'accepted' | 'declined') {
    const handledFriendRequest: FriendRequest = this.connectionProfileService.friendRequests.find(
      (friendRequest) => friendRequest.id === id
    );

    const unHandledFriendRequest: FriendRequest[] = this.connectionProfileService.friendRequests.filter(
      (friendRequest) => friendRequest.id !== id
    );

    this.connectionProfileService.friendRequests = unHandledFriendRequest;

    if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService.respondToFriendRequest(id, statusResponse).pipe(take(1)).subscribe();

  }
}
