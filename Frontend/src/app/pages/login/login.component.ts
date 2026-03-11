import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        @if (error) { <div class="error">{{ error }}</div> }
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Enter your password">
          </div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="link">Don't have an account? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
    .auth-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h2 { text-align: center; color: #1a1a2e; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.3rem; color: #555; font-size: 0.9rem; }
    input { width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    input:focus { outline: none; border-color: #e94560; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #e94560; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; margin-top: 0.5rem; }
    .btn-submit:hover { background: #d63851; }
    .btn-submit:disabled { background: #ccc; }
    .error { background: #ffe0e0; color: #d00; padding: 0.5rem; border-radius: 4px; margin-bottom: 1rem; text-align: center; }
    .link { text-align: center; margin-top: 1rem; color: #666; }
    .link a { color: #e94560; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.router.navigate(['/']);
        else this.error = res.message;
      },
      error: () => { this.loading = false; this.error = 'Login failed. Please try again.'; }
    });
  }
}
