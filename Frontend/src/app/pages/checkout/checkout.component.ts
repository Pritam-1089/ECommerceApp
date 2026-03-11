import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-page">
      <h2>Checkout</h2>
      <div class="checkout-layout">
        <div class="checkout-form">
          <h3>Shipping Address</h3>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="address.fullName" name="fullName">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="address.phone" name="phone">
          </div>
          <div class="form-group">
            <label>Address Line 1</label>
            <input type="text" [(ngModel)]="address.line1" name="line1">
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" [(ngModel)]="address.city" name="city">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>State</label>
              <input type="text" [(ngModel)]="address.state" name="state">
            </div>
            <div class="form-group">
              <label>Postal Code</label>
              <input type="text" [(ngModel)]="address.postalCode" name="postalCode">
            </div>
          </div>

          <h3>Payment Method</h3>
          <div class="payment-options">
            @for (method of paymentMethods; track method.value) {
              <label class="radio-option">
                <input type="radio" [(ngModel)]="selectedPayment" [value]="method.value" name="payment">
                {{ method.label }}
              </label>
            }
          </div>
        </div>

        <div class="order-summary">
          <h3>Order Summary</h3>
          @if (cart) {
            @for (item of cart.items; track item.id) {
              <div class="summary-item">
                <span>{{ item.productName }} x {{ item.quantity }}</span>
                <span>Rs. {{ item.totalPrice }}</span>
              </div>
            }
            <hr>
            <div class="summary-total">
              <span>Total</span>
              <span>Rs. {{ cart.totalAmount }}</span>
            </div>
            <button class="btn-place-order" (click)="placeOrder()" [disabled]="placing">
              {{ placing ? 'Placing Order...' : 'Place Order' }}
            </button>
          }
          @if (error) { <p class="error">{{ error }}</p> }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    h2 { color: #1a1a2e; margin-bottom: 1.5rem; }
    .checkout-layout { display: flex; gap: 2rem; }
    .checkout-form { flex: 2; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    label { display: block; margin-bottom: 0.3rem; color: #555; }
    input[type="text"], input[type="tel"] { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    h3 { color: #1a1a2e; margin: 1rem 0; }
    .payment-options { display: flex; flex-direction: column; gap: 0.5rem; }
    .radio-option { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid #eee; border-radius: 4px; cursor: pointer; }
    .order-summary { flex: 1; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); height: fit-content; }
    .summary-item { display: flex; justify-content: space-between; margin: 0.5rem 0; color: #555; }
    .summary-total { display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; color: #1a1a2e; }
    .btn-place-order { width: 100%; margin-top: 1rem; padding: 0.8rem; background: #4caf50; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; font-weight: bold; }
    .btn-place-order:hover { background: #43a047; }
    .btn-place-order:disabled { background: #ccc; }
    .error { color: #f44336; margin-top: 0.5rem; text-align: center; }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  address = { fullName: '', phone: '', line1: '', city: '', state: '', postalCode: '' };
  selectedPayment = 4; // COD
  placing = false;
  error = '';
  paymentMethods = [
    { value: 0, label: 'Credit Card' },
    { value: 1, label: 'Debit Card' },
    { value: 2, label: 'UPI' },
    { value: 3, label: 'Net Banking' },
    { value: 4, label: 'Cash on Delivery' },
  ];

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart();
  }

  placeOrder() {
    this.placing = true;
    this.error = '';
    this.orderService.createOrder({ shippingAddressId: 1, paymentMethod: this.selectedPayment }).subscribe({
      next: res => {
        this.placing = false;
        if (res.success) this.router.navigate(['/orders']);
        else this.error = res.message;
      },
      error: () => { this.placing = false; this.error = 'Order failed. Try again.'; }
    });
  }
}
