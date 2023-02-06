import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/model/user.model';


import { FriendRequestStatus, FriendRequest_Status, FriendRequest_Statuses } from '../../models/FriendRequest.model';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit, OnDestroy {

  user: User;
  friendRequestStatus: FriendRequest_Status;
  friendRequestStatusSubscribtion$: Subscription;
  userSubscribtion$: Subscription;
  statuses = FriendRequest_Statuses;

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connectionProfileService: ConnectionProfileService
  ) { }

  ngOnInit() {
    //this.getUser().subscribe(x => console.log(x));
    this.friendRequestStatusSubscribtion$ = this.getFriendRequestStatus().pipe(
      tap((friendRequestStatus: FriendRequestStatus) => {
        this.friendRequestStatus = friendRequestStatus.status;
        console.log(12, this.friendRequestStatus)
        this.userSubscribtion$ = this.getUser().subscribe((user: User) => {
          this.user = user;
          const imgPath = user.imagePath ?? 'blank-profile-picture.png';
          this.user.imagePath = 'http://localhost:3000/api/feed/image/' + imgPath;
        })
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.friendRequestStatusSubscribtion$.unsubscribe();
    this.userSubscribtion$.unsubscribe();
  }

  getUser(): Observable<User> {
    return this.getUserIdFromURL().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId);
      })
    )
  } 

  addUser(): Subscription {
    this.friendRequestStatus = 'pending';
    return this.getUserIdFromURL().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.addConnectionUser(userId);
      })
    ).pipe(take(1)).subscribe();
  }

  private getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromURL().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getFriendRequestStatus(userId)
      })
    )
  }

  private getUserIdFromURL(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return +urlSegment[0].path;
      })
    )
  }
}
