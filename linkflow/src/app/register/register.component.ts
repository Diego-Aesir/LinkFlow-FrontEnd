import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../api/auth.service';
import { UserService } from '../api/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  response: any;
  user: User = new User();
  errors: string[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router 
  ) {}

  onSubmit() {
    this.errors = [];

    if (!this.validateUsername()) return;
    if (!this.validateName()) return;
    if (!this.validateEmail()) return;
    if (!this.validatePassword()) return;

    const form = new FormData();
    form.append('UserName', this.user.userName);
    form.append('Name', this.user.name);
    form.append('UserEmail', this.user.userEmail);
    form.append('Pronoun', this.user.pronoun);
    form.append('Gender', this.user.gender);
    form.append('Password', this.user.password);
    form.append('Profile', this.user.profile);
    form.append('isGoogle', "false");

    if (this.user.photo) {
      form.append('Photo', this.user.photo, this.user.photo.name);
    }

    this.api.createUser(form).subscribe({
      next: (response) => this.response = response,
      error: (err) => { 
        window.alert("Wasn't possible to register this user, please verify 'username' or 'email' if it's already taken"); 
      },
      complete: () => {
        this.auth.setToken(this.response.jwt);
        this.userService.setUserId(this.response.id);
        window.location.assign("/home");
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.photo = file;
    }
  }

  validateUsername(): boolean {
    if (!this.user.userName || this.user.userName.trim().length < 3) {
      this.errors.push("Username must have at least 3 characters.");
      return false;
    }

    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(this.user.userName)) {
      this.errors.push("Username must only contain letters, numbers, or underscores.");
      return false;
    }

    return true;
  }

  validateName(): boolean {
    if (!this.user.name || this.user.name.trim().length < 3) {
      this.errors.push("Name must have at least 3 characters.");
      return false;
    }
    return true;
  }

  validateEmail(): boolean {
    if (!this.user.userEmail || this.user.userEmail.trim().length === 0) {
      this.errors.push("Email is required.");
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.user.userEmail)) {
      this.errors.push("Email is invalid.");
      this.errors.push("Ex: teste@test.com");
      return false;
    }

    return true;
  }

  validatePassword(): boolean {
    if (!this.user.password || this.user.password.trim().length === 0) {
      this.errors.push("Password is required.");
      return false;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordPattern.test(this.user.password)) {
      this.errors.push("Password must be at least 6 characters long, include both letters, numbers, and at least one special character (e.g., '!, @, #, $, %, ^, &, *').");
      return false;
    }

    if (!/[!@#$%^&*]/.test(this.user.password)) {
      this.errors.push("Password must include at least one special character (e.g., '!, @, #, $, %, ^, &, *').");
      return false;
    }

    return true;
  }
}
