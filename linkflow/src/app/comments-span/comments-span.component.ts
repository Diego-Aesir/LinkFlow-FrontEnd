import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments-span',
  imports: [],
  templateUrl: './comments-span.component.html',
  styleUrl: './comments-span.component.css'
})
export class CommentsSpanComponent implements OnInit {
  postId: string | null ='';

  constructor(private route : ActivatedRoute) {}

  ngOnInit(): void { 
    this.postId = this.route.snapshot.paramMap.get("postId");
  }
}
