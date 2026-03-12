import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <!-- Floating Shopping Items -->
      <div class="floating-items">
        <span class="float-item" style="--delay:0s; --x:15%; --y:25%">&#128091;</span>
        <span class="float-item" style="--delay:1.2s; --x:85%; --y:10%">&#128090;</span>
        <span class="float-item" style="--delay:2s; --x:10%; --y:75%">&#128087;</span>
        <span class="float-item" style="--delay:0.8s; --x:70%; --y:70%">&#127890;</span>
        <span class="float-item" style="--delay:1.5s; --x:45%; --y:85%">&#128094;</span>
        <span class="float-item" style="--delay:2.5s; --x:92%; --y:50%">&#128092;</span>
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
                <path d="M24 32h16M24 38h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h1>Join ShopEase</h1>
            <p>Create your account and start your shopping journey</p>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-num">10K+</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">5K+</span>
                <span class="stat-label">Happy Customers</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">100+</span>
                <span class="stat-label">Brands</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Register Form -->
        <div class="form-panel">
          <div class="form-content">
            <h2>Create Account</h2>
            <p class="subtitle">Fill in your details to get started</p>

            @if (error) {
              <div class="error slide-in">{{ error }}</div>
            }
            @if (success) {
              <div class="success slide-in">Account created! Redirecting...</div>
            }

            <form (ngSubmit)="onSubmit()" class="register-form">
              <div class="form-row">
                <div class="input-group">
                  <div class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input type="text" [(ngModel)]="form.firstName" name="firstName" required placeholder="First Name">
                </div>
                <div class="input-group">
                  <div class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input type="text" [(ngModel)]="form.lastName" name="lastName" required placeholder="Last Name">
                </div>
              </div>

              <div class="input-group">
                <div class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" [(ngModel)]="form.email" name="email" required placeholder="Email address">
              </div>

              <div class="input-group">
                <div class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <input type="tel" [(ngModel)]="form.phone" name="phone" required placeholder="Phone number">
              </div>

              <div class="input-group">
                <div class="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="form.password" name="password" required
                  placeholder="Create password" (input)="checkPasswordStrength()">
                <button type="button" class="toggle-pass" (click)="showPassword=!showPassword">
                  {{ showPassword ? '&#128064;' : '&#128065;' }}
                </button>
              </div>

              <!-- Password Strength -->
              @if (form.password) {
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" [style.width]="passwordStrength + '%'"
                      [style.background]="passwordStrength < 40 ? '#e94560' : passwordStrength < 70 ? '#f5a623' : '#0cce6b'">
                    </div>
                  </div>
                  <span class="strength-text" [style.color]="passwordStrength < 40 ? '#e94560' : passwordStrength < 70 ? '#f5a623' : '#0cce6b'">
                    {{ passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong' }}
                  </span>
                </div>
              }

              <button type="submit" class="btn-submit" [disabled]="loading" [class.loading]="loading">
                <span class="btn-text">{{ loading ? '' : 'Create Account' }}</span>
                @if (loading) {
                  <div class="spinner"></div>
                }
              </button>
            </form>

            <div class="divider"><span>OR</span></div>

            <p class="link">
              Already have an account?
              <a routerLink="/login">Sign In</a>
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
      max-width: 950px;
      min-height: 580px;
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
      flex: 0.9;
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
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-8px) rotate(-3deg); }
      75% { transform: translateY(-8px) rotate(3deg); }
    }
    .brand-content h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }
    .brand-content p {
      opacity: 0.85;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    /* Stats */
    .stats {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .stat-item {
      background: rgba(255,255,255,0.15);
      padding: 0.8rem;
      border-radius: 12px;
      backdrop-filter: blur(4px);
      animation: popIn 0.5s ease-out both;
      min-width: 80px;
    }
    .stat-item:nth-child(1) { animation-delay: 0.3s; }
    .stat-item:nth-child(2) { animation-delay: 0.5s; }
    .stat-item:nth-child(3) { animation-delay: 0.7s; }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    .stat-num { display: block; font-size: 1.3rem; font-weight: 700; }
    .stat-label { font-size: 0.7rem; opacity: 0.8; }

    /* Form Panel */
    .form-panel {
      flex: 1.1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .form-content { width: 100%; max-width: 380px; }
    .form-content h2 {
      font-size: 1.6rem;
      color: #1a1a2e;
      margin-bottom: 0.2rem;
      animation: fadeIn 0.5s ease-out 0.2s both;
    }
    .subtitle {
      color: #888;
      margin-bottom: 1.2rem;
      font-size: 0.85rem;
      animation: fadeIn 0.5s ease-out 0.3s both;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Form Row */
    .form-row { display: flex; gap: 0.8rem; }
    .form-row .input-group { flex: 1; }

    /* Input Groups */
    .input-group {
      position: relative;
      margin-bottom: 0.9rem;
      animation: fadeIn 0.5s ease-out both;
    }
    .input-group:nth-of-type(1) { animation-delay: 0.3s; }
    .input-group:nth-of-type(2) { animation-delay: 0.35s; }
    .input-group:nth-of-type(3) { animation-delay: 0.4s; }
    .input-group:nth-of-type(4) { animation-delay: 0.45s; }
    .input-group:nth-of-type(5) { animation-delay: 0.5s; }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      z-index: 1;
    }
    input {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    input:focus {
      outline: none;
      border-color: #e94560;
      background: white;
      box-shadow: 0 0 0 4px rgba(233,69,96,0.1);
    }
    .toggle-pass {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
    }

    /* Password Strength */
    .password-strength {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: -0.4rem 0 0.8rem;
      animation: fadeIn 0.3s ease-out;
    }
    .strength-bar {
      flex: 1;
      height: 4px;
      background: #e8e8e8;
      border-radius: 2px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: all 0.4s ease;
    }
    .strength-text { font-size: 0.75rem; font-weight: 600; min-width: 50px; }

    /* Submit Button */
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #e94560, #c62a71);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.3rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      animation: fadeIn 0.5s ease-out 0.6s both;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
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

    /* Messages */
    .error {
      background: linear-gradient(135deg, #ffe0e0, #ffd0d0);
      color: #d00;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      margin-bottom: 0.8rem;
      text-align: center;
      font-size: 0.85rem;
      border-left: 4px solid #d00;
    }
    .success {
      background: linear-gradient(135deg, #e0ffe0, #d0ffd0);
      color: #0a0;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      margin-bottom: 0.8rem;
      text-align: center;
      font-size: 0.85rem;
      border-left: 4px solid #0a0;
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
      margin: 1rem 0;
      animation: fadeIn 0.5s ease-out 0.7s both;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e0e0e0;
    }
    .divider span { padding: 0 1rem; color: #aaa; font-size: 0.8rem; }

    /* Link */
    .link {
      text-align: center;
      color: #888;
      font-size: 0.85rem;
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
      .auth-wrapper { flex-direction: column; max-width: 440px; }
      .brand-panel { padding: 1.5rem; min-height: auto; }
      .brand-content h1 { font-size: 1.4rem; }
      .brand-content p { margin-bottom: 1rem; font-size: 0.85rem; }
      .stats { gap: 0.5rem; }
      .stat-item { padding: 0.5rem; min-width: 60px; }
      .stat-num { font-size: 1rem; }
      .form-panel { padding: 1.5rem; }
      .form-row { flex-direction: column; gap: 0; }
    }
  `]
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '', phone: '' };
  error = '';
  success = false;
  loading = false;
  showPassword = false;
  passwordStrength = 0;

  constructor(private authService: AuthService, private router: Router) {}

  checkPasswordStrength() {
    const p = this.form.password;
    let strength = 0;
    if (p.length >= 6) strength += 20;
    if (p.length >= 8) strength += 15;
    if (/[a-z]/.test(p)) strength += 15;
    if (/[A-Z]/.test(p)) strength += 15;
    if (/[0-9]/.test(p)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(p)) strength += 20;
    this.passwordStrength = Math.min(100, strength);
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = false;
    this.authService.register(this.form).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.success = true;
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.error = res.message;
        }
      },
      error: () => { this.loading = false; this.error = 'Registration failed. Please try again.'; }
    });
  }
}
