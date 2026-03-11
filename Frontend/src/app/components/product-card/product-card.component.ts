import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card">
      <a [routerLink]="['/products', product.id]">
        <img [src]="product.imageUrl || 'https://via.placeholder.com/300x200'" [alt]="product.name" class="product-img">
      </a>
      <div class="product-info">
        <span class="category">{{ product.categoryName }}</span>
        <h3><a [routerLink]="['/products', product.id]">{{ product.name }}</a></h3>
        <div class="price-row">
          @if (product.discountPrice) {
            <span class="price discounted">Rs. {{ product.discountPrice }}</span>
            <span class="original-price">Rs. {{ product.price }}</span>
          } @else {
            <span class="price">Rs. {{ product.price }}</span>
          }
        </div>
        <div class="rating">
          @for (star of [1,2,3,4,5]; track star) {
            <span [class.filled]="star <= product.averageRating">&#9733;</span>
          }
          <span class="count">({{ product.reviewCount }})</span>
        </div>
        @if (authService.isLoggedIn()) {
          <button (click)="addToCart()" class="btn-cart" [disabled]="product.stockQuantity === 0">
            {{ product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-4px); }
    .product-img { width: 100%; height: 200px; object-fit: cover; }
    .product-info { padding: 1rem; }
    .category { color: #888; font-size: 0.8rem; text-transform: uppercase; }
    h3 { margin: 0.5rem 0; font-size: 1rem; }
    h3 a { color: #333; text-decoration: none; }
    h3 a:hover { color: #e94560; }
    .price-row { display: flex; gap: 0.5rem; align-items: center; }
    .price { font-weight: bold; color: #e94560; font-size: 1.1rem; }
    .original-price { text-decoration: line-through; color: #999; font-size: 0.9rem; }
    .rating span { color: #ddd; }
    .rating .filled { color: #ffc107; }
    .count { color: #888; font-size: 0.8rem; }
    .btn-cart { width: 100%; margin-top: 0.5rem; padding: 0.5rem; background: #e94560; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-cart:hover { background: #d63851; }
    .btn-cart:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService, public authService: AuthService) {}

  addToCart() {
    this.cartService.addToCart({ productId: this.product.id, quantity: 1 }).subscribe();
  }
}
