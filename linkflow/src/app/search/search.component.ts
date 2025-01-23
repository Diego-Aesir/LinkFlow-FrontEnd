import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [RouterModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  subject: string | null = '';
  posts: any | null[];
  postsFromTag: any | null;
  user: any;

  constructor(private route: ActivatedRoute, private api: ApiService){}

  ngOnInit(): void {
    this.subject = this.route.snapshot.paramMap.get('subject');
    if(this.subject) {
      this.getPostsByTitle(this.subject);
      this.getUserBySubject(this.subject);
    }
  }

  getPostsByTitle(subject: string) {
    let subjects: string[] = [subject];
    this.api.getPostsFromTitle(subjects, 1, 15).subscribe({
      next: (response) => this.posts = response,
      error: () => this.posts = [],
      complete: () => {
        if(this.posts.length == 0) {
          this.posts = null;
        }
        this.getPostsByTags(subject);
        console.log(this.posts);
      }
    })
  }

  getPostsByTags(subject: string) {
    let subjects: string[] = [subject];
    this.api.getPostsWithTags(subjects, 1, 15).subscribe({
      next: (response) => this.postsFromTag = response,
      error: () => this.postsFromTag = null,
      complete: () => {
        if(this.postsFromTag.length == 0) {
          this.postsFromTag = null;
        }
      }
    })
  }

  getUserBySubject(subject: string) {
    this.api.getUserPublicInfoByUsername(subject).subscribe({
      next: (response) => this.user = response,
      error: () => this.user = null,
    });
  }
}
