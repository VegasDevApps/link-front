import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit, OnDestroy {

  @Output() create: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController, private authService: AuthService) { }

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  ngOnInit() { 
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
      this.userFullImagePath = fullIamgePath;
    });
  }
  
  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe()
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) return;
    this.create.emit(data.post.body);
    //console.log('role: ', 'data: ', data);
  }
}
