import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginDto, RegisterDto } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5272/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, dto)
      .pipe(tap(res => { if (res.success) this.setUser(res.data); }));
  }

  login(dto: LoginDto): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, dto)
      .pipe(tap(res => { if (res.success) this.setUser(res.data); }));
  }

  logout(): void {
    localStorage.removeItem('ecom_user');
    localStorage.removeItem('ecom_token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('ecom_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'Admin';
  }

  private setUser(user: AuthResponse): void {
    localStorage.setItem('ecom_user', JSON.stringify(user));
    localStorage.setItem('ecom_token', user.token);
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('ecom_user');
    return user ? JSON.parse(user) : null;
  }
}
