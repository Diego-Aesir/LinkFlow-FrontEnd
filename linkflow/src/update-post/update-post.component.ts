import { Component, Input, OnInit } from '@angular/core';
import { Posts } from '../app/models/posts.model';
import { ApiService } from '../app/api/api.service';
import { UserService } from '../app/api/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit{
@Input() Post: any;
post: Posts = new Posts;
errors: string[] = [];
userId: any;

constructor(private api: ApiService, private userService: UserService){};


ngOnInit(): void {
  if(this.Post) {
    this.userId = this.userService.getUserId();
  }
}

onSubmit() {
  this.errors = [];
  if (!this.validTitle()) return;
  if (!this.validText()) return;

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

  this.api.updatePost(form, this.userId, this.Post.id).subscribe({
    error: () => window.alert("Could not update Post"),
    complete: () => window.location.reload()
  })
}

validTitle(): boolean {
  if(this.post.title) {
    if(this.post.title.trim().length < 3) {
      this.errors.push("Post Title must have at least 3 characters.");
      return false;
    }
  }

  return true;
}

validText(): boolean {
  if(this.post.text) {
    if(this.post.text.trim().length < 3) {
      this.errors.push("Post Text must have at least 3 characters.");
      return false;
    }
  }
  
  return true;
}

addTag(): void {
  this.post.tags.push('');
}

removeTag(index: number): void {
  this.post.tags.splice(index, 1);
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.post.photo = file;
  }
}
}
