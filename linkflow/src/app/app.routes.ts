import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {path: 'home', component: MainPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'postDetails/:postId', component: PostDetailsComponent},
    {path: 'userDetails/:username', component: UserDetailsComponent},
    {path: 'search/:subject', component: SearchComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
