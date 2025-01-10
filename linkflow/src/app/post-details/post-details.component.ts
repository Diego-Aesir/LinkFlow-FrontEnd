import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../models/comment.model';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-post-details',
  imports: [CommonModule, CommentsComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})

export class PostDetailsComponent implements OnInit {
  @Input() postId: any;
  post: any;
  loading: boolean = false;
  username: string = "";
  isCommenting: boolean = false;
  commentForm: FormGroup; 
  comments: any;

  constructor(
    private route: ActivatedRoute,
    private api : ApiService,
    private clipboard: Clipboard,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('postId');
    this.post = this.getPostDetails(this.postId);
  }

  getPostDetails(id: string): void {
    this.loading = true;
    this.api.getPostById(id).subscribe({
      next: (response) => this.post = response,
      error: (err) => window.alert(err),
      complete: () => {
        this.getPostOwner(this.post.ownerId);
        console.log(this.post.id);
        this.getPostComments(this.postId);
        this.loading = false
      }
    });
  }
  
  getPostOwner(ownerId: string): void {
    this.loading = true;
    this.api.getUsernameById(ownerId).subscribe({
      next: (response) => this.username = response,
      error: (err) => window.alert(err),
      complete: () => this.loading = false
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
        const newComment = this.commentForm.value.comment;
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
            null
          );
  
          this.api.createComment(comment);
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
