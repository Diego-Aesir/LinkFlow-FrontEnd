import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api/api.service';
import { PostsComponent } from '../posts-list/posts-list.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { Posts } from '../models/posts.model';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, PostsComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  posts: any[] = [];
  createPost = false;
  userId: any;
  post: Posts = new Posts;
  errors: string[] = [];
  
  constructor(private api: ApiService, private router: Router, private userService: UserService){};

  ngOnInit() {
    this.getPosts();
    this.userId = this.userService.getUserId();
  }

  Search = new FormGroup({
    searchInput: new FormControl('', Validators.required)
  })

  onSubmit() {
    this.errors = [];
    if (!this.validTitle()) return;
    if (!this.validText()) return;
    if (!this.validTags()) return;

    const form = new FormData();
    form.append('Title', this.post.title);
    form.append('Text', this.post.text);
    this.post.tags.forEach((tag, index) => {
      form.append(`Tags[${index}]`, tag);
    });
    form.append('OwnerId', this.userId);

    if (this.post.photo) {
      form.append('Photo', this.post.photo, this.post.photo.name);
    }

    this.api.createPost(form).subscribe({
      error: () => window.alert("Could not create Post"),
      complete: () => window.location.reload()
    })

  }

  validTitle(): boolean {
    if(!this.post.title || this.post.title.trim().length < 3) {
      this.errors.push("Post Title must have at least 3 characters.");
      return false;
    }
    return true;
  }

  validText(): boolean {
    if(!this.post.text || this.post.text.trim().length < 3) {
      this.errors.push("Post Text must have at least 3 characters.");
      return false;
    }
    return true;
  }

  addTag(): void {
    this.post.tags.push('');
  }
  
  removeTag(index: number): void {
    this.post.tags.splice(index, 1);
  }

  validTags() {
    if(!this.post.tags) {
      this.errors.push("Post must have at least one Tag");
      return false;
    }
    return true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.post.photo = file;
    }
  }

  getPosts(): void {
    this.api.getPostsWithoutTags(1, 10).subscribe({
      next: (response) => this.posts = response,
      error: (err) => window.alert(err),
    });
  }

  onSearch() {
    const searchText = this.Search.get('searchInput')?.value;
    this.router.navigateByUrl(`/search/${searchText}`);
  }

  userPage() {
    if(this.userId) {
      this.api.getUserById(this.userId).subscribe({
        next: (response) => {
          this.router.navigate(['/userDetails', response.userName]);
        },
        error: () => window.alert("Could not access your User settings"),
      });

    } else {
      if(window.confirm("You must be logged in order to access settings. Wanna Login?")) {
        this.router.navigate(['/login']);
      }
    }
  }

  userLogout() {
    if(window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.assign("/home");
    }
  }
}
