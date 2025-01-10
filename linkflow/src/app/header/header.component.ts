import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../api/user.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  title: string = 'LinkFlow';
  isLogged: boolean = false;
  userId: string | null = "";
  username: string | null = "";

  constructor(
      private userService : UserService,
      private api : ApiService,
      private router: Router,
    ) {}
  
  ngOnInit(): void {
    this.VerifyLogin();
    if(this.isLogged != false && this.userId != null) {
      this.getUsername(this.userId);
    } else {
      this.username = null;
    }
  }

  VerifyLogin() {
    this.userId = this.userService.getUserId(); 
    if(this.userId != null) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  getUsername(userId: string) {
    this.api.getUsernameById(userId).subscribe({
      next: (response) => this.username = response,
      error: (err) => window.alert(err),
    })
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

  userPage(username: any) {
    this.router.navigate(['/userDetails', username]);
  }
}
