import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Role } from 'src/app/auth/model/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BannerColor, BannerColorService } from '../../services/banner-color.service';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './pofile-summary.component.html',
  styleUrls: ['./pofile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {

  form: FormGroup;

  validFileExtensions: validFileExtension[] = ['png' , 'jpg' , 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];
  
  userFullImagePath: string;
  private userImagePathSubscriptions: Subscription;


  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  constructor(private authService: AuthService, public bannerColorService: BannerColorService) { }

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null)
    });
    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColorService.bannerColor = this.bannerColorService.getBannerColor(role);
    });

    this.authService.userFullName.pipe(
      take(1)
    ).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });

    this.userImagePathSubscriptions = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
      this.userFullImagePath = fullIamgePath;
    });


  }

  ngOnDestroy(): void {
    this.userImagePathSubscriptions.unsubscribe();
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer()).pipe(
      switchMap((buffer: Buffer) => {
        return from(fromBuffer(buffer)).pipe(
          switchMap((fileTypeResult: FileTypeResult) => {
            if (!fileTypeResult) {
              console.log({ error: 'file format not supported!' });
              return of();
            }
            const { ext, mime } = fileTypeResult;
            const isFileTypeIsLegit = this.validFileExtensions.includes(ext as any);
            const isMimeTypeIsLegit = this.validMimeTypes.includes(mime as any);
            const isFileLegit = isFileTypeIsLegit && isMimeTypeIsLegit;
            if (!isFileLegit) {
              console.log({ error: 'file format does not match file contend!' });
              return of();
            }
            return this.authService.uploadUserImage(formData);
          })
        );
      })
    ).subscribe();
    this.form.reset();
  }
}
