import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="logo">ShopEase</a>
        <div class="nav-links">
          <a routerLink="/products">Products</a>
          @if (authService.isLoggedIn()) {
            <a routerLink="/cart" class="cart-link">
              Cart
              @if (cartService.getCartItemCount() > 0) {
                <span class="badge">{{ cartService.getCartItemCount() }}</span>
              }
            </a>
            <a routerLink="/orders">My Orders</a>
            @if (authService.isAdmin()) {
              <a routerLink="/admin">Admin</a>
            }
            <span class="user-name">{{ (authService.currentUser$ | async)?.fullName }}</span>
            <button (click)="logout()" class="btn-logout">Logout</button>
          } @else {
            <a routerLink="/login">Login</a>
            <a routerLink="/register" class="btn-register">Register</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: #1a1a2e; padding: 1rem 0; position: sticky; top: 0; z-index: 100; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { color: #e94560; font-size: 1.5rem; font-weight: bold; text-decoration: none; }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-links a { color: #eee; text-decoration: none; transition: color 0.3s; }
    .nav-links a:hover { color: #e94560; }
    .cart-link { position: relative; }
    .badge { background: #e94560; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; position: absolute; top: -8px; right: -12px; }
    .user-name { color: #aaa; font-size: 0.9rem; }
    .btn-logout { background: none; border: 1px solid #e94560; color: #e94560; padding: 0.3rem 1rem; border-radius: 4px; cursor: pointer; }
    .btn-logout:hover { background: #e94560; color: white; }
    .btn-register { background: #e94560; color: white !important; padding: 0.3rem 1rem; border-radius: 4px; }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService, public cartService: CartService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
