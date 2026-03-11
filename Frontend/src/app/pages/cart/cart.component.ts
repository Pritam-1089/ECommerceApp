import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <h2>Shopping Cart</h2>
      @if (cart && cart.items.length > 0) {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cart.items; track item.id) {
              <div class="cart-item">
                <img [src]="item.productImage || 'https://via.placeholder.com/80'" [alt]="item.productName">
                <div class="item-info">
                  <h3>{{ item.productName }}</h3>
                  <p class="item-price">Rs. {{ item.price }}</p>
                </div>
                <div class="quantity">
                  <button (click)="updateQty(item.id, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQty(item.id, item.quantity + 1)">+</button>
                </div>
                <p class="item-total">Rs. {{ item.totalPrice }}</p>
                <button class="btn-remove" (click)="remove(item.id)">X</button>
              </div>
            }
          </div>
          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Items ({{ cart.items.length }})</span><span>Rs. {{ cart.totalAmount }}</span></div>
            <div class="summary-row"><span>Shipping</span><span>Free</span></div>
            <hr>
            <div class="summary-row total"><span>Total</span><span>Rs. {{ cart.totalAmount }}</span></div>
            <a routerLink="/checkout" class="btn-checkout">Proceed to Checkout</a>
            <button (click)="clearAll()" class="btn-clear">Clear Cart</button>
          </div>
        </div>
      } @else {
        <div class="empty-cart">
          <p>Your cart is empty</p>
          <a routerLink="/products" class="btn-shop">Continue Shopping</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    h2 { color: #1a1a2e; margin-bottom: 1.5rem; }
    .cart-layout { display: flex; gap: 2rem; }
    .cart-items { flex: 2; }
    .cart-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
    .item-info { flex: 1; }
    .item-info h3 { margin: 0; font-size: 1rem; color: #333; }
    .item-price { color: #888; margin: 0.3rem 0 0; }
    .quantity { display: flex; align-items: center; gap: 0.5rem; }
    .quantity button { width: 28px; height: 28px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; border-radius: 4px; }
    .item-total { font-weight: bold; color: #e94560; min-width: 80px; text-align: right; }
    .btn-remove { background: none; border: none; color: #f44336; cursor: pointer; font-weight: bold; font-size: 1rem; }
    .cart-summary { flex: 1; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); height: fit-content; }
    .summary-row { display: flex; justify-content: space-between; margin: 0.5rem 0; color: #555; }
    .summary-row.total { font-weight: bold; font-size: 1.2rem; color: #1a1a2e; }
    .btn-checkout { display: block; text-align: center; background: #e94560; color: white; padding: 0.8rem; border-radius: 4px; text-decoration: none; margin-top: 1rem; font-weight: bold; }
    .btn-clear { width: 100%; margin-top: 0.5rem; padding: 0.5rem; background: none; border: 1px solid #ddd; color: #888; cursor: pointer; border-radius: 4px; }
    .empty-cart { text-align: center; padding: 3rem; }
    .empty-cart p { color: #888; font-size: 1.2rem; margin-bottom: 1rem; }
    .btn-shop { background: #e94560; color: white; padding: 0.8rem 2rem; border-radius: 4px; text-decoration: none; }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart();
  }

  updateQty(itemId: number, qty: number) {
    this.cartService.updateItem(itemId, qty).subscribe();
  }

  remove(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  clearAll() {
    this.cartService.clearCart().subscribe();
  }
}
