import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/Post.model';
import { PostService } from '../../services/post.service';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit, OnChanges {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() postBody?: string;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts =5;
  skipPost = 0;

  userId$ = new BehaviorSubject<number>(null);

  constructor(private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.getPosts(null);
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const postBody = changes.postBody.currentValue;
    if (!postBody) return;
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.allLoadedPosts.unshift(post);
    });
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

  async presentUpdateModal(id: number) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
      componentProps: {
        id
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) return;
    
    const newPostBody = data.post.body;
    this.postService.updatePost(id, newPostBody).subscribe(() => {
      const postIndex = this.allLoadedPosts.findIndex((post: Post) => post.id === id);
      this.allLoadedPosts[postIndex].body = newPostBody;
    });
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter((post: Post) => post.id !== id);
    });
  }
}
