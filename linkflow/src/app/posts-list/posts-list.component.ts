import { Component, Input, OnInit } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api/api.service';
import { Router, RouterModule } from '@angular/router'; 
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../models/comment.model';
import { UserService } from '../api/user.service';
import { UpdatePostComponent } from "../../update-post/update-post.component";

@Component({
  selector: 'app-posts',
  imports: [CommonModule, CommentsComponent, RouterModule, ReactiveFormsModule, UpdatePostComponent],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsComponent implements OnInit {
  @Input() post: any;
  username: string = "";
  loading: boolean = false;
  isCommenting: boolean = false;
  commentForm: FormGroup; 
  comments: any;
  seeComments = false;
  isPostOwner = false;
  updatePost = false;

  constructor(
    private api: ApiService,
    private clipboard: Clipboard,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { 
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    if (this.post) {
      if(userId && userId == this.post.ownerId) {
        this.isPostOwner = true;
      }
      this.getPostOwner(this.post.ownerId);
    }
  }

  getPostDetails(id: string): void {
    this.loading = true;
    this.api.getPostById(id).subscribe({
      next: (response) => this.post = response,
      error: (err) => window.alert(err),
      complete: () => this.loading = false
    });
  }

  getPostOwner(ownerId: string): void {
    this.loading = true;
    this.api.getUsernameById(ownerId).subscribe({
      next: (response) => this.username = response,
      error: (err) => window.alert(err),
      complete: () => this.getPostComments(this.post.id)
    });
  }

  getPostComments(postId: string) {
    this.loading = true;
    this.api.getCommentFromPost(postId).subscribe({
      next: (response) => this.comments = response,
      error: (err) => {this.comments = null},
      complete: () => this.loading = false
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment: string = this.commentForm.value.comment;
      this.commentForm.reset();
      this.isCommenting = false;
      const userId = this.userService.getUserId();
      if(userId == null) {
        if(window.confirm("You must be logged in order to leave a Comment. Wanna Login?")) {
          this.router.navigate(['/login']);
        }
      } else {
          const comment: Comment = new Comment(
          this.post.id,
          userId,
          newComment,
          []
        );

        this.api.createComment(comment).subscribe({
          error: (err) => window.alert(err),
          complete: () => this.getPostComments(this.post.id)
        });
      }
    }
  }

  sharePost(): void {
    const postUrl = window.location.href + '/post-details/' + this.post.id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl).then(() => {
      }).catch(err => console.error('Erro ao copiar para a área de transferência:', err));
    } else {
      this.clipboard.copy(postUrl);
    }
  }

  openComments() {
    if(this.seeComments == false) {
      this.seeComments = true;
    } else {
      this.seeComments = false;
    }
  }

  deletePost() {
    const userId = this.userService.getUserId();
    if(userId) {
      if(window.confirm(`Are you sure you want to Delete this post: ${this.post.title}`)) {
        this.api.deletePost(userId, this.post.id).subscribe({
          error: () => window.alert("Could not delete your post, please try again later"),
          complete: () => {
            window.alert("Post deleted successfully");
            window.location.reload();
          } 
        })
      }
    } else {
      window.alert("You have been logged out, please try again later");
    }
  }

  getFullImageUrl(imagePath: string): string {
    return `${this.api.apiUrl}${imagePath}`;
  }
}
