import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

import { NewUser } from '../model/new-user.mode';
import { Role, User } from '../model/user.model';
import { UserResponse } from '../model/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<User>(null);
  private readonly baseApiUrl = `${environment.baseApiUrl}/auth`;

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  
  constructor(private http: HttpClient, private router: Router) { }
  
  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean>{
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.role);
      })
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.id);
      })
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const fullUserName = user.firstName + ' ' + user.lastName;
        return of(fullUserName);
      })
    );
  }

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHaveImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultFullImagePath();
        if(doesAuthorHaveImage) {
          fullImagePath = this.getFullImagePath(user.imagePath);
        }
        return of(fullImagePath);
      })
    );
  }

  getDefaultFullImagePath(): string {
    return 'http://localhost:3000/api/feed/image/blank-profile-picture.png';
  }

  getFullImagePath(imageName: string): string {
    return 'http://localhost:3000/api/feed/image/' + imageName;
  }

  getUserImage(){
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  getUserImageName(): Observable<{ imageName: string }>{
    return this.http.get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`).pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  }

  uploadUserImage(formData: FormData): Observable<{ modifiedFileName: string }>{
    return this.http.post<{ modifiedFileName: string }>(
      `${environment.baseApiUrl}/user/upload`,
      formData,
      ).pipe(
        tap(({modifiedFileName}) => {
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
          this.user$.next(user);
        })
      ); 
  }

  register(newUser: NewUser): Observable<User>{
    return this.http.post<User>(
      `${this.baseApiUrl}/register`,
      newUser,
      this.httpOptions
      ).pipe(
        take(1)
      );
  }

  login(email: string, password: string): Observable<{token: string}> {
     return this.http.post<{token: string}>(
      `${this.baseApiUrl}/login`,
      { email, password },
      this.httpOptions
      ).pipe(
        take(1),
        tap(( res: {token: string} ) => {
          Preferences.set({
            key: 'token',
            value: res.token
          });

          const decodedToken: UserResponse = jwt_decode(res.token);
          this.user$.next(decodedToken.user);

        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(Preferences.get({key: 'token'})).pipe(
      map((data: { value: string}) => {
        if(!data || !data.value) return null;

        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMs = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMs);

        if(isExpired) return null;
        if(decodedToken.user){
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    )
  }

  logout(): void {
    this.user$.next(null);
    Preferences.remove({ key: 'token'});
    this.router.navigateByUrl('/auth');
  }
}

