import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div class="cards">
        <a routerLink="/admin/products" class="card">
          <h3>Manage Products</h3>
          <p>Add, Edit, Delete products</p>
        </a>
        <a routerLink="/admin/orders" class="card">
          <h3>Manage Orders</h3>
          <p>View and update order status</p>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    h2 { color: #1a1a2e; margin-bottom: 1.5rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; transition: transform 0.3s; border-left: 4px solid #e94560; }
    .card:hover { transform: translateY(-4px); }
    .card h3 { color: #1a1a2e; margin-bottom: 0.5rem; }
    .card p { color: #888; }
  `]
})
export class DashboardComponent {}
