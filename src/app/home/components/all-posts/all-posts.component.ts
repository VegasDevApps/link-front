import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/auth/model/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Post } from '../../models/Post.model';
import { PostService } from '../../services/post.service';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit, OnChanges, OnDestroy {

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

  // userFullImagePath: string;
  // private userImagePathSubscription: Subscription;

  private userSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  ngOnInit() {

    this.userSubscription = this.authService.userStream.subscribe((user: User) => {
      this.allLoadedPosts.forEach((post: Post, index: number) => {
        if (user?.imagePath && post.author.id === user.id) {
          this.allLoadedPosts[index].author.imagePath = this.authService.getFullImagePath(user.imagePath);
        }
      });
    });

    this.getPosts(null);
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
    // this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullIamgePath: string) => {
    //   this.userFullImagePath = fullIamgePath;
    // });
    this.authService.userFullName.pipe(
      take(1)
    ).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const postBody = changes.postBody.currentValue;
    if (!postBody) return;
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.authService.userFullImagePath.pipe(
        take(1)
      ).subscribe((fullImagePath: string) => {
        post.author.imagePath = fullImagePath; 
      });

      this.allLoadedPosts.unshift(post);
    });
  }

  ngOnDestroy(): void {
    //this.userImagePathSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  getPosts(event){
    if(this.skipPost === 20){
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPost}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
      //this.allLoadedPosts = [...this.allLoadedPosts, ...posts];
      for (let postIndex = 0; postIndex < posts.length; postIndex++) {
        const post = posts[postIndex];
        const doesAuthorHaveImage = !!post.author.imagePath;
        let fullIamgePath = this.authService.getDefaultFullImagePath();
        if (doesAuthorHaveImage) {
          fullIamgePath = this.authService.getFullImagePath(post.author.imagePath);
        }
        post.author.imagePath = fullIamgePath;
        this.allLoadedPosts.push(post);
      }

      if(event) event.target.complete();
      this.skipPost += 5;
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
