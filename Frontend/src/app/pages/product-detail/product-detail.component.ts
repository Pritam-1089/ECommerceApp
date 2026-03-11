import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (product) {
      <div class="detail-page">
        <div class="product-image">
          <img [src]="product.imageUrl || 'https://via.placeholder.com/500x400'" [alt]="product.name">
        </div>
        <div class="product-info">
          <span class="category">{{ product.categoryName }}</span>
          <h1>{{ product.name }}</h1>
          <div class="rating">
            @for (star of [1,2,3,4,5]; track star) {
              <span [class.filled]="star <= product.averageRating">&#9733;</span>
            }
            <span>({{ product.reviewCount }} reviews)</span>
          </div>
          <div class="price-section">
            @if (product.discountPrice) {
              <span class="price">Rs. {{ product.discountPrice }}</span>
              <span class="original">Rs. {{ product.price }}</span>
              <span class="discount">{{ getDiscount() }}% OFF</span>
            } @else {
              <span class="price">Rs. {{ product.price }}</span>
            }
          </div>
          <p class="description">{{ product.description }}</p>
          <p class="stock" [class.out]="product.stockQuantity === 0">
            {{ product.stockQuantity > 0 ? 'In Stock (' + product.stockQuantity + ' available)' : 'Out of Stock' }}
          </p>
          <div class="quantity">
            <button (click)="qty > 1 && qty = qty - 1">-</button>
            <span>{{ qty }}</span>
            <button (click)="qty < product.stockQuantity && qty = qty + 1">+</button>
          </div>
          @if (authService.isLoggedIn()) {
            <button class="btn-add" (click)="addToCart()" [disabled]="product.stockQuantity === 0">Add to Cart</button>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-page { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; display: flex; gap: 3rem; }
    .product-image { flex: 1; }
    .product-image img { width: 100%; border-radius: 8px; }
    .product-info { flex: 1; }
    .category { color: #888; text-transform: uppercase; font-size: 0.8rem; }
    h1 { margin: 0.5rem 0; color: #1a1a2e; }
    .rating span { color: #ddd; font-size: 1.2rem; }
    .rating .filled { color: #ffc107; }
    .price-section { margin: 1rem 0; display: flex; align-items: center; gap: 1rem; }
    .price { font-size: 2rem; font-weight: bold; color: #e94560; }
    .original { text-decoration: line-through; color: #999; font-size: 1.2rem; }
    .discount { background: #4caf50; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9rem; }
    .description { color: #555; line-height: 1.6; margin: 1rem 0; }
    .stock { font-weight: bold; color: #4caf50; }
    .stock.out { color: #f44336; }
    .quantity { display: flex; align-items: center; gap: 1rem; margin: 1rem 0; }
    .quantity button { width: 36px; height: 36px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; font-size: 1.2rem; border-radius: 4px; }
    .quantity span { font-size: 1.2rem; font-weight: bold; }
    .btn-add { padding: 1rem 3rem; background: #e94560; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; }
    .btn-add:hover { background: #d63851; }
    .btn-add:disabled { background: #ccc; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  qty = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe(res => {
      if (res.success) this.product = res.data;
    });
  }

  getDiscount(): number {
    if (!this.product?.discountPrice) return 0;
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart({ productId: this.product.id, quantity: this.qty }).subscribe();
  }
}
