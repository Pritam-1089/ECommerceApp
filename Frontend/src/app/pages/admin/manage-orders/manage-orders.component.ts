import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-orders">
      <h2>Manage Orders</h2>
      <table>
        <thead>
          <tr><th>Order #</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          @for (order of orders; track order.id) {
            <tr>
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.createdAt | date:'short' }}</td>
              <td>{{ order.items.length }} items</td>
              <td>Rs. {{ order.totalAmount }}</td>
              <td><span class="status" [class]="order.status.toLowerCase()">{{ order.status }}</span></td>
              <td>
                <select (change)="updateStatus(order.id, $event)">
                  <option value="">Change Status</option>
                  @for (s of statuses; track s.value) {
                    <option [value]="s.value">{{ s.label }}</option>
                  }
                </select>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .manage-orders { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    h2 { color: #1a1a2e; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    th { background: #1a1a2e; color: white; padding: 0.8rem; text-align: left; }
    td { padding: 0.8rem; border-bottom: 1px solid #eee; }
    .status { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; }
    .pending { background: #fff3cd; color: #856404; }
    .confirmed { background: #cce5ff; color: #004085; }
    .processing { background: #d4edda; color: #155724; }
    .shipped { background: #d1ecf1; color: #0c5460; }
    .delivered { background: #d4edda; color: #155724; }
    .cancelled { background: #f8d7da; color: #721c24; }
    select { padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; }
  `]
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  statuses = [
    { value: 0, label: 'Pending' }, { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Processing' }, { value: 3, label: 'Shipped' },
    { value: 4, label: 'Delivered' }, { value: 5, label: 'Cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(res => {
      if (res.success) this.orders = res.data;
    });
  }

  updateStatus(orderId: number, event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, value).subscribe(() => this.ngOnInit());
  }
}
