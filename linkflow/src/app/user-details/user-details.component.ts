import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../api/api.service';
import { UserService } from '../api/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from "../comments/comments.component";

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, FormsModule, RouterModule, CommentsComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  username: string | null = '';
  isUser = false;
  update = false;
  userInfo: any;
  response: any;
  user: User = new User();
  errors: string[] = [];
  posts: any;
  comments: any;

  constructor(private route: ActivatedRoute, private api: ApiService, private userService: UserService) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.getUser();
  }

  verifyUser() {
    const userId = this.userService.getUserId();
    if(userId != null) {
      if(userId == this.userInfo.id) {
        this.isUser = true;
      }
    } else {
      this.isUser = false;
    }
  }

  getUser() {
    if(this.username != null) {
      this.api.getUserPublicInfoByUsername(this.username).subscribe({
        next: (response) => {this.userInfo = response; console.log(response)},
        error: () => window.alert("Error while retriaving this user information"),
        complete: () => {
          this.verifyUser();
          this.getUserPosts();
          this.getUserComments();
        }
      });
    }
  }

  getUserPosts() {
    this.api.getPostsFromUserId(this.userInfo.id, 1, 10).subscribe({
      next: (response) => this.posts = response,
      error: () => {window.alert("Could not find any Posts from this user")}
    });
  }

  getUserComments() {
    this.api.getCommentFromUser(this.userInfo.id).subscribe({
      next: (response) => this.comments = response,
      error: () => window.alert("Could not find any Comments from this user")
    });
  }

  getFullImageUrl(imagePath: string): string {
    return `${this.api.apiUrl}${imagePath}`;
  }

  onSubmit() {
    this.errors = [];

    if (!this.validateUsername()) return;
    if (!this.validateName()) return;
    if (!this.validateEmail()) return;
    if (!this.validatePassword()) return;

    const form = new FormData();

    form.append('UserName', this.user.userName);
    form.append('Name', this.user.name);
    form.append('UserEmail', this.user.userEmail);
    form.append('Pronoun', this.user.pronoun);
    form.append('Gender', this.user.gender);
    form.append('Password', this.user.password);
    form.append('Profile', this.user.profile);
    form.append('isGoogle', "false");

    if (this.user.photo) {
      form.append('Photo', this.user.photo, this.user.photo.name);
    }


    this.api.updateUser(this.userInfo.id, form).subscribe({
      next: (response) => {
        this.response = response;
        if(this.user.userName) {
          window.location.assign(`/userDetails/${this.user.userName}`);
        } else {
          window.location.reload();
        }
      },
      error: () => { 
        window.alert("Wasn't possible to update this user"); 
      },
      complete: () => {
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.photo = file;
    }
  }

  validateUsername(): boolean {
    if(this.user.userName) {
      if (this.user.userName.trim().length < 3) {
        this.errors.push("Username must have at least 3 characters.");
        return false;
      }
  
      const usernamePattern = /^[a-zA-Z0-9_]+$/;
      if (!usernamePattern.test(this.user.userName)) {
        this.errors.push("Username must only contain letters, numbers, or underscores.");
        return false;
      }  
    }  
    return true;
  }

  validateName(): boolean {
    if(this.user.name) {
      if (this.user.name.trim().length < 3) {
        this.errors.push("Name must have at least 3 characters.");
        return false;
      }
    }
    return true;
  }

  validateEmail(): boolean {
    if(this.user.userEmail) {
      if (this.user.userEmail.trim().length === 0) {
        this.errors.push("Email is required.");
        return false;
      }
  
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.user.userEmail)) {
        this.errors.push("Email is invalid.");
        this.errors.push("Ex: teste@test.com");
        return false;
      }
    }

    return true;
  }

  validatePassword(): boolean {
    if(this.user.password) {
      if (this.user.password.trim().length === 0) {
        this.errors.push("Password is required.");
        return false;
      }
  
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
      if (!passwordPattern.test(this.user.password)) {
        this.errors.push("Password must be at least 6 characters long, include both letters, numbers, and at least one special character (e.g., '!, @, #, $, %, ^, &, *').");
        return false;
      }
  
      if (!/[!@#$%^&*]/.test(this.user.password)) {
        this.errors.push("Password must include at least one special character (e.g., '!, @, #, $, %, ^, &, *').");
        return false;
      }
    }

    return true;
  }
}
