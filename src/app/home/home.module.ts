import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ProfileSummaryComponent } from './components/pofile-summary/pofile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { ModalComponent } from './components/start-post/modal/modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    HeaderComponent,
    PopoverComponent,
    AdvertisingComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    ModalComponent,
  ]
})
export class HomePageModule {}
