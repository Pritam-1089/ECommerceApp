import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product, CreateProduct, Category } from '../../../models/product.model';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-products">
      <h2>Manage Products</h2>

      <div class="form-section">
        <h3>{{ editingId ? 'Edit Product' : 'Add New Product' }}</h3>
        <form (ngSubmit)="saveProduct()">
          <div class="form-row">
            <div class="form-group"><label>Name</label><input [(ngModel)]="form.name" name="name" required></div>
            <div class="form-group"><label>SKU</label><input [(ngModel)]="form.sku" name="sku" required></div>
          </div>
          <div class="form-group"><label>Description</label><textarea [(ngModel)]="form.description" name="desc" rows="3"></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Price</label><input type="number" [(ngModel)]="form.price" name="price" required></div>
            <div class="form-group"><label>Discount Price</label><input type="number" [(ngModel)]="form.discountPrice" name="discountPrice"></div>
            <div class="form-group"><label>Stock</label><input type="number" [(ngModel)]="form.stockQuantity" name="stock" required></div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="form.categoryId" name="category">
                @for (cat of categories; track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
            <div class="form-group"><label>Image URL</label><input [(ngModel)]="form.imageUrl" name="imageUrl"></div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-save">{{ editingId ? 'Update' : 'Create' }}</button>
            @if (editingId) { <button type="button" (click)="cancelEdit()" class="btn-cancel">Cancel</button> }
          </div>
        </form>
      </div>

      <table class="products-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (p of products; track p.id) {
            <tr>
              <td>{{ p.id }}</td><td>{{ p.name }}</td><td>{{ p.sku }}</td>
              <td>Rs. {{ p.discountPrice || p.price }}</td><td>{{ p.stockQuantity }}</td>
              <td>{{ p.categoryName }}</td>
              <td>
                <button (click)="editProduct(p)" class="btn-edit">Edit</button>
                <button (click)="deleteProduct(p.id)" class="btn-delete">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .manage-products { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    h2 { color: #1a1a2e; }
    .form-section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-group { margin-bottom: 0.8rem; flex: 1; }
    label { display: block; margin-bottom: 0.2rem; color: #555; font-size: 0.85rem; }
    input, textarea, select { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .form-actions { display: flex; gap: 0.5rem; }
    .btn-save { padding: 0.5rem 2rem; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-cancel { padding: 0.5rem 2rem; background: #888; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .products-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    th { background: #1a1a2e; color: white; padding: 0.8rem; text-align: left; }
    td { padding: 0.8rem; border-bottom: 1px solid #eee; }
    .btn-edit { background: #2196f3; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; margin-right: 0.3rem; }
    .btn-delete { background: #f44336; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; }
  `]
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  form: CreateProduct = { name: '', description: '', sku: '', price: 0, discountPrice: null, stockQuantity: 0, imageUrl: '', categoryId: 0 };
  editingId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.productService.getCategories().subscribe(res => { if (res.success) this.categories = res.data; });
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => { if (res.success) this.products = res.data; });
  }

  saveProduct() {
    if (this.editingId) {
      this.productService.update(this.editingId, this.form).subscribe(() => { this.cancelEdit(); this.loadProducts(); });
    } else {
      this.productService.create(this.form).subscribe(() => { this.resetForm(); this.loadProducts(); });
    }
  }

  editProduct(p: Product) {
    this.editingId = p.id;
    this.form = { name: p.name, description: p.description, sku: p.sku, price: p.price, discountPrice: p.discountPrice, stockQuantity: p.stockQuantity, imageUrl: p.imageUrl, categoryId: p.categoryId };
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure?')) {
      this.productService.delete(id).subscribe(() => this.loadProducts());
    }
  }

  cancelEdit() { this.editingId = null; this.resetForm(); }

  resetForm() { this.form = { name: '', description: '', sku: '', price: 0, discountPrice: null, stockQuantity: 0, imageUrl: '', categoryId: 0 }; }
}
