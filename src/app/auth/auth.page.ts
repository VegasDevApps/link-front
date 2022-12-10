import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  @ViewChild('form') form: NgForm;

  //submissionType: 'login' | 'join' = 'login';
  isLogin: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return;

    if (this.isLogin) {
      console.log(1, 'Handle login', email, password);
    } else {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return;
      console.log(2, 'Handle Join', firstName, lastName, email, password);
    }
   
  }

  toggleText() {
    // if (this.submissionType === 'login') {
    //   this.submissionType = 'join';
    // } else if (this.submissionType === 'join') {
    //   this.submissionType = 'login';
    // }

    this.isLogin = !this.isLogin;

  }
}
