import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  subject: string | null = '';

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.subject = this.route.snapshot.paramMap.get('subject');
  }
}
