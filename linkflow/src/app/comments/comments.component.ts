import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentToComment } from '../models/comment_to_comment.model';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @Input() comment: any;
  @Input() commentToComment: boolean = false;
  response: any;
  username: string | null='';
  isCommenting = false;
  asnwerInput: FormGroup;
  seeComments = false;
  commentsOfComment: any[] = [];
  isCommentToComment: boolean | null = true;
  commentCount = 0;
  isOwner = false;
  editComment = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.asnwerInput = this.fb.group({
      answer: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    if(this.comment) {
      this.verifyIfIsCommentToComment(this.comment.id);
      this.getUsername();
      this.getCommentsOfComment();
      this.updateCommentCount();
      if(this.comment.ownerId == this.userService.getUserId()) {
        this.isOwner = true;
      }
      if(this.comment.text == null || this.comment.text == '') {
        this.comment.text = '[Deleted comment]';
      }
    }
  }

  getUsername() {
    this.api.getUsernameById(this.comment.ownerId).subscribe({
      next: (response) => this.response = response,
      error: (err) => {window.alert("Couldn't get this username"); this.username = "deleted"},
      complete: () => this.username = this.response
    })
  }

  onSubmit() {
    if(this.asnwerInput.valid) {
      const userId = this.userService.getUserId();
      if(userId == null) {
        if(window.confirm("You must be logged in order to leave a Comment. Wanna Login?")) {
          this.router.navigate(['/login']);
        }
      } else {
        let newComment = new CommentToComment(
          this.comment.id,
          userId,
          this.asnwerInput.value.answer,
          []
        );
        
        this.api.createCommentToComment(this.comment.id, newComment).subscribe({
        error: (err) => window.alert("Wasn't possible to answer this comment"),
        complete: () => {
          this.getCommentById(this.comment.id);
          this.getCommentsOfComment();
          this.commentCount++;
        }
      });
        this.asnwerInput.reset();
        this.isCommenting = false;
        this.seeComments = false;
      }
    }
  }

  getCommentsOfComment() {
    this.commentsOfComment = [];
    for(let comment of this.comment.commentsId) {
      this.api.getCommentToCommentById(comment).subscribe({
        next: (response) => {this.commentsOfComment.push(response);}
      });
    }
  }

  verifyIfIsCommentToComment(commentId: string) {
    this.api.getCommentToCommentById(commentId).subscribe({
      next: () => {
        this.isCommentToComment = true;
      },
      error: () => {
        this.isCommentToComment = false;
      }
    });
  }

  getCommentById(commentId: string) {
    if(this.isCommentToComment) {
      this.api.getCommentToCommentById(commentId).subscribe({
        next: (response) => this.comment = response,
        error: () => window.alert("Could not retrieve answers from this Comment")
      });
    } else {
      this.api.getComment(commentId).subscribe({
        next: (response) => this.comment = response,
        error: (err) => window.alert("Could not retrieve answers from this Comment")
      });
    }
  }

  updateCommentCount() {
    this.commentCount = this.comment.commentsId.length;
  }

  updateComment() {
    if (this.asnwerInput.valid) {
      const updatedText: string = this.asnwerInput.value.answer;
      const userId = this.userService.getUserId();

      if (userId == null) {
        if (window.confirm("You must be logged in to update a comment. Wanna Login?")) {
          this.router.navigate(['/login']);
        }
      } else {
        if (this.isCommentToComment) {
          this.updateCommentOfComment(updatedText);
        } else {
          this.updateCommentOfPost(updatedText);
        }
      }
    }
  }

  updateCommentOfPost(commentText: string) {
    this.api.updateComment(this.comment.id, commentText).subscribe({
      error: (err) => window.alert("Failed to update this comment " + err),
      complete: () => {
        this.comment.text = commentText;
        this.getCommentById(this.comment.id);
        this.editComment = false;
      }
    })
  }

  updateCommentOfComment(commentText: string) {
    this.api.updateCommentToComment(this.comment.id, commentText).subscribe({
      error: (err) => window.alert("Failed to update this comment" + err),
      complete: () => {
        this.comment.text = commentText;
        this.getCommentById(this.comment.id);
        this.editComment = false;
      }
    });
  }

  deleteComment() {
    const userId = this.userService.getUserId();
    if(this.isOwner && userId != null) {
      if(window.confirm(`Are you sure you want to delete this text: \"${this.comment.text}\"`)) {
        if(this.isCommentToComment) {
          this.api.deleteCommentToComment(this.comment.id, userId).subscribe({
            error: (err) => window.alert(err)
          });          
        } else {
          this.api.deleteComment(this.comment.id, userId).subscribe({
            error: (err) => window.alert(err)
          }); 
        }
        this.comment.text = '[Deleted Comment]';
      } else {
        return;
      }
    }
  }
}