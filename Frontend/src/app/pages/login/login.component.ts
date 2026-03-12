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
    <div class="auth-page">
      <!-- Floating Shopping Items Animation -->
      <div class="floating-items">
        <span class="float-item" style="--delay:0s; --x:10%; --y:20%">&#128091;</span>
        <span class="float-item" style="--delay:1s; --x:80%; --y:15%">&#128090;</span>
        <span class="float-item" style="--delay:2s; --x:20%; --y:70%">&#128087;</span>
        <span class="float-item" style="--delay:3s; --x:75%; --y:65%">&#127890;</span>
        <span class="float-item" style="--delay:0.5s; --x:50%; --y:80%">&#128094;</span>
        <span class="float-item" style="--delay:1.5s; --x:90%; --y:40%">&#128092;</span>
        <span class="float-item" style="--delay:2.5s; --x:5%; --y:45%">&#9996;</span>
      </div>

      <div class="auth-wrapper">
        <!-- Left Panel - Branding -->
        <div class="brand-panel">
          <div class="brand-content">
            <div class="bag-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20h40l-4 36H16L12 20z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
                <path d="M22 20c0-6.627 4.477-12 10-12s10 5.373 10 12" stroke="white" stroke-width="2" fill="none"/>
                <circle cx="26" cy="20" r="2" fill="white"/>
                <circle cx="38" cy="20" r="2" fill="white"/>
              </svg>
            </div>
            <h1>ShopEase</h1>
            <p>Your one-stop destination for everything you love</p>
            <div class="features">
              <div class="feature-item">
                <span class="feature-icon">&#128666;</span>
                <span>Free Delivery</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">&#128274;</span>
                <span>Secure Payment</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">&#128257;</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="form-panel">
          <div class="form-content">
            <h2>Welcome Back!</h2>
            <p class="subtitle">Sign in to continue shopping</p>

            @if (error) {
              <div class="error slide-in">{{ error }}</div>
            }

            <form (ngSubmit)="onSubmit()" class="login-form">
              <div class="input-group">
                <div class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="Email address"
                  (focus)="emailFocused=true" (blur)="emailFocused=false"
                  [class.active]="emailFocused || email">
              </div>

              <div class="input-group">
                <div class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" required
                  placeholder="Password" (focus)="passFocused=true" (blur)="passFocused=false"
                  [class.active]="passFocused || password">
                <button type="button" class="toggle-pass" (click)="showPassword=!showPassword">
                  {{ showPassword ? '&#128064;' : '&#128065;' }}
                </button>
              </div>

              <button type="submit" class="btn-submit" [disabled]="loading" [class.loading]="loading">
                <span class="btn-text">{{ loading ? '' : 'Sign In' }}</span>
                @if (loading) {
                  <div class="spinner"></div>
                }
              </button>
            </form>

            <div class="divider">
              <span>OR</span>
            </div>

            <p class="link">
              Don't have an account?
              <a routerLink="/register">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      position: relative;
      overflow: hidden;
      padding: 1rem;
    }

    /* Floating Items */
    .floating-items { position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
    .float-item {
      position: absolute;
      font-size: 2rem;
      left: var(--x);
      top: var(--y);
      opacity: 0.15;
      animation: floatUp 6s ease-in-out infinite;
      animation-delay: var(--delay);
    }
    @keyframes floatUp {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(15deg); }
    }

    /* Wrapper */
    .auth-wrapper {
      display: flex;
      width: 100%;
      max-width: 900px;
      min-height: 520px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      animation: cardAppear 0.6s ease-out;
      position: relative;
      z-index: 1;
    }
    @keyframes cardAppear {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Brand Panel */
    .brand-panel {
      flex: 1;
      background: linear-gradient(135deg, #e94560, #c62a71);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }
    .brand-panel::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
      top: -80px;
      right: -80px;
    }
    .brand-panel::after {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
      bottom: -50px;
      left: -50px;
    }
    .brand-content {
      text-align: center;
      color: white;
      position: relative;
      z-index: 1;
    }
    .bag-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      animation: bagBounce 2s ease-in-out infinite;
    }
    @keyframes bagBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .brand-content h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }
    .brand-content p {
      opacity: 0.85;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }
    .features { display: flex; flex-direction: column; gap: 0.8rem; }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255,255,255,0.15);
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.9rem;
      backdrop-filter: blur(4px);
      animation: slideRight 0.5s ease-out both;
    }
    .feature-item:nth-child(1) { animation-delay: 0.3s; }
    .feature-item:nth-child(2) { animation-delay: 0.5s; }
    .feature-item:nth-child(3) { animation-delay: 0.7s; }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .feature-icon { font-size: 1.2rem; }

    /* Form Panel */
    .form-panel {
      flex: 1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
    }
    .form-content { width: 100%; max-width: 340px; }
    .form-content h2 {
      font-size: 1.8rem;
      color: #1a1a2e;
      margin-bottom: 0.3rem;
      animation: fadeIn 0.5s ease-out 0.2s both;
    }
    .subtitle {
      color: #888;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      animation: fadeIn 0.5s ease-out 0.3s both;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Input Groups */
    .input-group {
      position: relative;
      margin-bottom: 1.2rem;
      animation: fadeIn 0.5s ease-out both;
    }
    .input-group:nth-child(1) { animation-delay: 0.4s; }
    .input-group:nth-child(2) { animation-delay: 0.5s; }
    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      z-index: 1;
    }
    input {
      width: 100%;
      padding: 0.85rem 0.85rem 0.85rem 2.8rem;
      border: 2px solid #e8e8e8;
      border-radius: 12px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    input:focus, input.active {
      outline: none;
      border-color: #e94560;
      background: white;
      box-shadow: 0 0 0 4px rgba(233,69,96,0.1);
    }
    .toggle-pass {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 4px;
    }

    /* Submit Button */
    .btn-submit {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(135deg, #e94560, #c62a71);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      animation: fadeIn 0.5s ease-out 0.6s both;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
    }
    .btn-submit::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    .btn-submit:hover::before { left: 100%; }
    .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(233,69,96,0.4); }
    .btn-submit:active { transform: translateY(0); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .spinner {
      width: 22px; height: 22px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Error */
    .error {
      background: linear-gradient(135deg, #ffe0e0, #ffd0d0);
      color: #d00;
      padding: 0.7rem 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 0.9rem;
      border-left: 4px solid #d00;
    }
    .slide-in { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      margin: 1.2rem 0;
      animation: fadeIn 0.5s ease-out 0.7s both;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e0e0e0;
    }
    .divider span {
      padding: 0 1rem;
      color: #aaa;
      font-size: 0.8rem;
    }

    /* Link */
    .link {
      text-align: center;
      color: #888;
      font-size: 0.9rem;
      animation: fadeIn 0.5s ease-out 0.8s both;
    }
    .link a {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }
    .link a:hover { color: #c62a71; }

    /* Responsive */
    @media (max-width: 768px) {
      .auth-wrapper { flex-direction: column; max-width: 420px; }
      .brand-panel { padding: 1.5rem; min-height: auto; }
      .brand-content h1 { font-size: 1.5rem; }
      .brand-content p { margin-bottom: 1rem; }
      .features { flex-direction: row; flex-wrap: wrap; justify-content: center; }
      .feature-item { font-size: 0.8rem; padding: 0.4rem 0.7rem; }
      .form-panel { padding: 1.5rem; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  emailFocused = false;
  passFocused = false;

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
