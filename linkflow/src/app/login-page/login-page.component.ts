import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AuthService } from '../api/auth.service';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  response: any;

  constructor(
    private router: Router, 
    private api: ApiService, 
    private auth: AuthService, 
    private userService: UserService,
  ) {}

  login = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit() {
  }

  onSubmit() {
    const username = this.login.get('username')?.value;
    const password = this.login.get('password')?.value;

    if(username != null && password != null) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password)

      this.api.loginUser(formData).subscribe({
        next: (response) => this.response = response,
        error: (err) => {window.alert(err)},
        complete: () => {
          this.userService.setUserId(this.response.id);
          this.auth.setToken(this.response.jwt);
          window.location.assign("/home");
        }
      });
    } else {
      window.alert("Something has gone wrong with your login, please try again");
    }
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}
