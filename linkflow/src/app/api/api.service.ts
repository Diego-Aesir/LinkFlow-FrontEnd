import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { CommentToComment } from '../models/comment_to_comment.model';

@Injectable({
  providedIn: 'root', 
})

export class ApiService {
  public apiUrl = 'http://localhost:6060';
  private userBase = 'api/User';
  private postBase = 'api/Posts';
  private commentBase = 'api/Comments';
  private commentToCommentBase = 'api/CommentToComment';

  constructor(private http: HttpClient) { }

  createUser(form: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.userBase}/register`, form);
  }

  createGoogleUser(googleToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.userBase}/register/google`, googleToken);
  }

  loginUser(formData: FormData) {
    return this.http.post(`${this.apiUrl}/${this.userBase}/login`, formData);
  }

  loginGoogleUser(googleToken: string) {
    return this.http.post(`${this.apiUrl}/${this.userBase}/login/google`, googleToken);
  }
  
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.userBase}/${id}`);
  }

  getUsernameById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.userBase}/${id}/username`);
  }

  getUserPublicInfoByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.userBase}/${username}/public`);

  }

  updateUser(userId: string, form: FormData) {
    return this.http.put(`${this.apiUrl}/${this.userBase}/update/${userId}`, form);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.userBase}/delete/${userId}`);
  }

  verifyJwt(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.userBase}/jwt`);
  }

  createPost(form: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.postBase}/create`, form);
  }

  getPostById(id: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.postBase}/${id}`);
  }

  getPostsWithoutTags(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.postBase}/recent/${page}/${limit}`);
  }

  getPostsWithTags(tags: string[], page: number, limit: number): Observable<any> {
    let params = new HttpParams();
    tags.forEach(tag => {
      params = params.append('tags', tag);
    });
    return this.http.get(`${this.apiUrl}/${this.postBase}/recent/tags/${page}/${limit}`, { params });
  }

  getPostsFromUserId(userId: string, page: number, limit: number) : Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.postBase}/recent/user:${userId}/${page}/${limit}`)
  }

  getPostsFromTitle(titles: string[], page: number, limit: number) : Observable<any> {
    let params = new HttpParams();
    titles.forEach(title => {
      params = params.append("titles", title);
    })
    return this.http.get(`${this.apiUrl}/${this.postBase}/recent/titles/${page}/${limit}`, {params});
  }

  updatePost(form: FormData, userId: string, postId: string) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${this.postBase}/update/${userId}/${postId}`, form);
  }

  deletePost(userId: string, postId: string) : Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.postBase}/delete/${userId}/${postId}`);
  }

  createComment(comment: Comment) {
    return this.http.post(`${this.apiUrl}/${this.commentBase}/create`, comment);
  }

  getComment(commentId: string) {
    return this.http.get(`${this.apiUrl}/${this.commentBase}/${commentId}`);
  }

  getCommentFromPost(postId: string) {
    return this.http.get(`${this.apiUrl}/${this.commentBase}/post/${postId}`);
  }

  getCommentFromUser(userId: string) {
    return this.http.get(`${this.apiUrl}/${this.commentBase}/user/${userId}`);
  }

  updateComment(commentId: string, commentText: string) {
    const body = { text: commentText };
    return this.http.put(`${this.apiUrl}/${this.commentBase}/update/${commentId}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })});
  }

  deleteComment(commentId: string, ownerId: string) {
    return this.http.delete(`${this.apiUrl}/${this.commentBase}/delete/${ownerId}/${commentId}`);
  }

  createCommentToComment(parentCommentId: string, comment: CommentToComment) {
    return this.http.post(`${this.apiUrl}/${this.commentToCommentBase}/create/parentComment:${parentCommentId}`, comment);
  }

  getCommentToCommentById(commentId: string) {
    return this.http.get(`${this.apiUrl}/${this.commentToCommentBase}/${commentId}`);
  }

  getCommentToCommentFromUser(userId: string) {
    return this.http.get(`${this.apiUrl}/${this.commentToCommentBase}/user/${userId}`);
  }

  updateCommentToComment(commentId: string, commentText: string) {
    const body = { text: commentText };
    return this.http.put(`${this.apiUrl}/${this.commentToCommentBase}/update/${commentId}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteCommentToComment(commentId: string, ownerId: string) {
    return this.http.delete(`${this.apiUrl}/${this.commentToCommentBase}/delete/ownerId:${ownerId}/${commentId}`);
  }
}
