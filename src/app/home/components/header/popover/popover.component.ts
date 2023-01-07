import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';
  
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
      this.userFullImagePath = fullIamgePath;
    });

    this.authService.userFullName.pipe(
      take(1)
    ).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  onSignOut(){
    this.authService.logout();
  }

}
