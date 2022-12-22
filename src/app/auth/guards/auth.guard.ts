import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isUserLoggedIn.pipe(take(1),
    switchMap((isUserLoggedIn: boolean) => {
      if(isUserLoggedIn){
        return of(isUserLoggedIn);
      }
    }),
    tap((isUserLoggedIn: boolean) => {
      if(!isUserLoggedIn){
        this.router.navigateByUrl('/auth');
      }
    }));
  }
}
