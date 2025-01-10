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

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router 
  ) {}

  onSubmit() {
    const form = new FormData();
    form.append('UserName', this.user.userName);
    form.append('Name', this.user.name);
    form.append('UserEmail', this.user.userEmail);
    form.append('Pronoun', this.user.pronoun);
    form.append('Gender', this.user.gender);
    form.append('Password', this.user.password);
    form.append('Profile', this.user.profile);
    form.append('isGoogle', "false");

    if(this.user.photo) {
      form.append('Photo', this.user.photo, this.user.photo.name);
    }

    this.api.createUser(form).subscribe({
      next: (response) => this.response = response,
      error: (err) => window.alert(err),
      complete: () => {
        console.log(this.response);
        this.auth.setToken(this.response.jwt);
        this.userService.setUserId(this.response.id);
        window.location.reload();
        this.router.navigateByUrl("/home");
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.photo = file;
    }
  }
}
