import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewUser } from './model/new-user.mode';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  @ViewChild('form') form: NgForm;

  //submissionType: 'login' | 'join' = 'login';
  isLogin: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return;

    if (this.isLogin) {
      // Video #10 1:03:00
      console.log(1, 'Handle login', email, password);
    } else {
      const { firstName, lastName } = this.form.value;

      const newUser: NewUser = {firstName, lastName, email, password};
      
      return this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
      
      //console.log(2, 'Handle Join', firstName, lastName, email, password);
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
