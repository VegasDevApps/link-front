import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandleService } from 'src/app/core/error-handler.servce';
import { environment } from 'src/environments/environment';
import { Post } from '../models/Post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly baseApiUrl = `${environment.baseApiUrl}/feed`;

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandleService: ErrorHandleService
  ) {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
      const defaultImagePath = 'blank-profile-picture.png';
      this.authService.updateUserImagePath(imageName || defaultImagePath).subscribe();
    })).subscribe();
   }

  getSelectedPosts(params){
    return this.http.get<Post[]>(`${this.baseApiUrl}/${params}`).pipe(
      tap((posts: Post[]) => {
        if (posts.length === 0) throw new Error('No feeds to retrieve');
      }),
      catchError(
        this.errorHandleService.handleError<Post[]>('getSelectedPosts', [])
      )
    );
  }

  createPost(body: string) {
    return this.http.post<Post>(this.baseApiUrl, { body }, this.httpOptions).pipe(take(1));
  }

  updatePost(postId: number, body: string) {
    return this.http.put(`${this.baseApiUrl}/${postId}`, { body }, this.httpOptions).pipe(take(1));
  }

  deletePost(postId: number) {
    return this.http.delete(`${this.baseApiUrl}/${postId}`).pipe(take(1));
  }
}
