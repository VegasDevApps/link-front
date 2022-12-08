import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Post } from '../../models/Post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts =5;
  skipPost = 0;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts(null);
  }

  getPosts(event){
    if(this.skipPost === 20){
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPost}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
      this.allLoadedPosts = [...this.allLoadedPosts, ...posts];
      
      if(event) event.target.complete();
      this.skipPost += 5;
    }, (error) => {
      console.error(error);
    });
  }

  loadData(event){
    this.getPosts(event);
  }
}
