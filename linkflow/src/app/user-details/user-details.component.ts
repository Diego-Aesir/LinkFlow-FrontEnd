import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  username: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
  }
}
