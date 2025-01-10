import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api/api.service';
import { Posts } from '../models/posts.model';
import { PostsComponent } from '../posts-list/posts-list.component';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, PostsComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  posts: any[] = [];
  loading: boolean = false;
  
  constructor(private api: ApiService){};

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.loading = true;
    this.api.getPostsWithoutTags(1, 10).subscribe({
      next: (response) => this.posts = response,
      error: (err) => window.alert(err),
      complete: () => this.loading = false
    })
  }
}
