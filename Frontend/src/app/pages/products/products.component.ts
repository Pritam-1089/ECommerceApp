import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="products-page">
      <div class="sidebar">
        <h3>Categories</h3>
        <ul>
          <li (click)="filterByCategory(0)" [class.active]="selectedCategory === 0">All Products</li>
          @for (cat of categories; track cat.id) {
            <li (click)="filterByCategory(cat.id)" [class.active]="selectedCategory === cat.id">{{ cat.name }}</li>
          }
        </ul>
      </div>
      <div class="main">
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Search products...">
          <button (click)="search()">Search</button>
        </div>
        <div class="products-grid">
          @for (product of products; track product.id) {
            <app-product-card [product]="product" />
          } @empty {
            <p class="no-products">No products found.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; display: flex; gap: 2rem; }
    .sidebar { width: 220px; flex-shrink: 0; }
    .sidebar h3 { color: #1a1a2e; margin-bottom: 1rem; }
    .sidebar ul { list-style: none; padding: 0; }
    .sidebar li { padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; margin-bottom: 0.3rem; color: #555; }
    .sidebar li:hover, .sidebar li.active { background: #e94560; color: white; }
    .main { flex: 1; }
    .search-bar { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .search-bar input { flex: 1; padding: 0.7rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
    .search-bar button { padding: 0.7rem 1.5rem; background: #1a1a2e; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .no-products { color: #888; text-align: center; padding: 3rem; }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.productService.getCategories().subscribe(res => {
      if (res.success) this.categories = res.data;
    });
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(+params['category']);
      } else {
        this.loadAll();
      }
    });
  }

  loadAll() {
    this.selectedCategory = 0;
    this.productService.getAll().subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 0) { this.loadAll(); return; }
    this.productService.getByCategory(categoryId).subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }

  search() {
    if (!this.searchTerm.trim()) { this.loadAll(); return; }
    this.productService.search(this.searchTerm).subscribe(res => {
      if (res.success) this.products = res.data;
    });
  }
}
