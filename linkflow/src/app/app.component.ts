import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ApiService } from './api/api.service';
import { AuthService } from './api/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'linkflow';

  constructor(private api: ApiService, private auth: AuthService){
    if(auth.getToken()) {
      this.api.verifyJwt().subscribe({
        error: (err) => {console.log(err); localStorage.clear(); window.location.reload();}
      });
    }
  }
}
