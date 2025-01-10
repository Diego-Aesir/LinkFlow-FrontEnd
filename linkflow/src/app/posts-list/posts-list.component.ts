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

@Component({
  selector: 'app-posts',
  imports: [CommonModule, CommentsComponent, RouterModule, ReactiveFormsModule],
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
    if (this.post) {
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
      error: (err) => {console.log(err); this.comments = null},
      complete: () => this.loading = false
    });
  }

  startCommenting(): void {
    this.isCommenting = true;
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
          error: (err) => window.alert(err)
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
}
