import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  @Input() id?: number;

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  onPost() {
    if (!this.form.valid) {
      return;
    }

    const body = this.form.value['body'];
    this.modalController.dismiss({
      post: {
        body,
      }
    }, 'post');
    console.log(8);
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }
}
