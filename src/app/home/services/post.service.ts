import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
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


  constructor(private http: HttpClient) { }

  getSelectedPosts(params){
    return this.http.get<Post[]>(`${this.baseApiUrl}/${params}`);
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
