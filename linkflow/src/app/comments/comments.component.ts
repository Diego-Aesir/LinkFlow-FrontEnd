import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @Input() comment: any;

  ngOnInit(): void {
    if(this.comment) {
      //console.log(this.postId);
    }
  }
}
