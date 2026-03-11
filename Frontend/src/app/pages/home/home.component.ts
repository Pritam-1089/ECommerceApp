import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to <span>ShopEase</span></h1>
        <p>Discover amazing products at unbeatable prices</p>
        <a routerLink="/products" class="btn-shop">Shop Now</a>
      </div>
    </section>

    <section class="section">
      <h2>Categories</h2>
      <div class="categories-grid">
        @for (cat of categories; track cat.id) {
          <a [routerLink]="['/products']" [queryParams]="{category: cat.id}" class="category-card">
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.description }}</p>
          </a>
        }
      </div>
    </section>

    <section class="section">
      <h2>Featured Products</h2>
      <div class="products-grid">
        @for (product of featuredProducts; track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    </section>
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 5rem 2rem; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero span { color: #e94560; }
    .hero p { font-size: 1.2rem; color: #aaa; margin-bottom: 2rem; }
    .btn-shop { background: #e94560; color: white; padding: 0.8rem 2rem; border-radius: 4px; text-decoration: none; font-size: 1.1rem; }
    .section { max-width: 1200px; margin: 3rem auto; padding: 0 1rem; }
    .section h2 { font-size: 1.8rem; margin-bottom: 1.5rem; color: #1a1a2e; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .category-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-decoration: none; color: #333; transition: all 0.3s; border: 2px solid transparent; }
    .category-card:hover { border-color: #e94560; transform: translateY(-2px); }
    .category-card h3 { color: #1a1a2e; margin-bottom: 0.5rem; }
    .category-card p { color: #666; font-size: 0.9rem; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe(res => {
      if (res.success) this.featuredProducts = res.data.slice(0, 8);
    });
    this.productService.getCategories().subscribe(res => {
      if (res.success) this.categories = res.data;
    });
  }
}
