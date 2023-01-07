import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Role } from 'src/app/auth/model/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

type BannerColor = {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './pofile-summary.component.html',
  styleUrls: ['./pofile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit {

  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png' , 'jpg' , 'jpeg'];
  validMimeTypes: validMimeType[] = [ 'image/png' , 'image/jpg' , 'image/jpeg'];

  constructor(private authService: AuthService) { }

  bannerColor: BannerColor = {
    colorOne: '#a0b4b7',
    colorTwo: '#dbe7e9',
    colorThree: '#bfd3d6'
  }

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null)
    });
    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColor = this.getBannerColor(role);
    })
  }

  private getBannerColor(role: Role): BannerColor {
    switch(role){
      case 'admin':
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#bfafad2'
        }

      case 'premium':
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf'
        }

      default:
        return this.bannerColor;
    }
  }

  onFileSelect(event: Event): void {
    console.log(event);
    const file: File = (event.target as HTMLInputElement).files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Video #14 43:47
  }
}
