import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';


@Injectable({
  providedIn: 'root'})

export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      console.log('Logged out');
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true });
  }

  register(email: string, password: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/register`,
    { email, password },
    { withCredentials: true } // ensures cookies/session from backend are used
    );
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { withCredentials: true });
  }
}

  //isLoggedIn(): boolean {
  //  return !!this.currentUserSubject.value;
 // }
