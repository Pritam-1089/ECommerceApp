# ECommerceApp - ShopEase

E-Commerce application built with ASP.NET Core Web API, SQL Server, and Angular.

## Prerequisites

Before starting, make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| .NET SDK | 9.0+ | https://dotnet.microsoft.com/download/dotnet/9.0 |
| SQL Server Express | 2019+ | https://www.microsoft.com/en-us/sql-server/sql-server-downloads |
| SQL Server Management Studio (SSMS) | Latest | https://learn.microsoft.com/en-us/ssms/download-sql-server-management-studio-ssms |
| Node.js | 18+ | https://nodejs.org/ |
| Angular CLI | 19+ | Run: `npm install -g @angular/cli` |
| Git | Latest | https://git-scm.com/downloads |

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pritam-1089/ECommerceApp.git
cd ECommerceApp
```

### Step 2: Check Your SQL Server Instance Name

Open PowerShell and run:
```powershell
Get-Service | Where-Object { $_.Name -like '*SQL*' }
```

Note your instance name. Common values:
- `.\SQLEXPRESS` (SQL Server Express)
- `.` or `localhost` (SQL Server default instance)
- `.\MSSQLSERVER`

### Step 3: Update Connection String

Open `Backend/ECommerce.API/appsettings.json` and update the `Server` value to match YOUR SQL Server instance:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=ECommerceDB;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

**IMPORTANT:** If your SQL Server instance name is different, replace `.\SQLEXPRESS` with your instance name.

### Step 4: Install EF Core Tool (One-time)

```bash
dotnet tool install --global dotnet-ef
```

If already installed, update it:
```bash
dotnet tool update --global dotnet-ef
```

### Step 5: Run Database Migration

```bash
cd Backend/ECommerce.API
dotnet ef database update --project ../ECommerce.Infrastructure
```

This will automatically create the `ECommerceDB` database with all tables.

### Step 6: Seed Data

1. Open **SSMS** and connect to your SQL Server
2. Open file `Database/SeedData.sql`
3. Make sure `ECommerceDB` is selected in the database dropdown
4. Click **Execute** (or press F5)

This will insert:
- 2 Roles (Admin, Customer)
- 6 Categories
- 8 Sample Products

### Step 7: Create Admin User

After seeding, register a user via API or frontend, then run this SQL in SSMS:

```sql
USE ECommerceDB;
UPDATE Users SET RoleId = 1 WHERE Email = 'admin@shopease.com';
```

Or use the pre-seeded admin: `admin@shopease.com` / `Admin@123`

### Step 8: Run Backend

```bash
cd Backend/ECommerce.API
dotnet run
```

Backend will start at: `http://localhost:5272`

Verify by opening: `http://localhost:5272/swagger`

### Step 9: Run Frontend

Open a **new terminal**:

```bash
cd Frontend
npm install
ng serve
```

Frontend will start at: `http://localhost:4200`

## Common Errors and Fixes

### Error: "Failed to bind to address http://127.0.0.1:5272: address already in use"
Port 5272 is already in use. Kill the old process:
```powershell
# Find the process
netstat -ano | findstr :5272
# Kill it (replace PID with actual number)
taskkill /F /PID <PID>
```

### Error: "A network-related or instance-specific error occurred while establishing a connection to SQL Server"
- SQL Server service is not running. Start it:
```powershell
net start MSSQL$SQLEXPRESS
```
- Or your instance name is wrong in `appsettings.json`. Check Step 2 above.

### Error: "Login failed for user"
- Make sure `Trusted_Connection=true` is in the connection string
- Or your Windows user doesn't have SQL Server access. Open SSMS, connect, go to Security > Logins and add your Windows user.

### Error: "dotnet-ef not found"
```bash
dotnet tool install --global dotnet-ef
```
Then restart your terminal.

### Error: "ng is not recognized"
```bash
npm install -g @angular/cli
```

## Project Structure

```
ECommerceApp/
├── Backend/
│   ├── ECommerce.API/          # Controllers, Program.cs, Config
│   ├── ECommerce.Application/  # Services, DTOs, Interfaces
│   ├── ECommerce.Core/         # Entities, Repository Interfaces
│   └── ECommerce.Infrastructure/ # DbContext, Repositories, Migrations
├── Frontend/                   # Angular 19 App
│   └── src/app/
│       ├── pages/              # Components (home, products, cart, etc.)
│       ├── services/           # API services
│       ├── models/             # TypeScript interfaces
│       ├── guards/             # Auth guards
│       └── interceptors/       # HTTP interceptors
└── Database/
    └── SeedData.sql            # Initial seed data
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/products | No | Get all products |
| GET | /api/products/{id} | No | Get product by ID |
| GET | /api/products/search?q= | No | Search products |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/{id} | Admin | Update product |
| DELETE | /api/products/{id} | Admin | Delete product |
| GET | /api/categories | No | Get all categories |
| POST | /api/categories | Admin | Create category |
| GET | /api/cart | User | Get cart |
| POST | /api/cart/items | User | Add to cart |
| PUT | /api/cart/items/{id} | User | Update cart item |
| DELETE | /api/cart/items/{id} | User | Remove cart item |
| POST | /api/orders | User | Create order |
| GET | /api/orders | User | Get my orders |
| GET | /api/orders/{id} | User | Get order by ID |
| PUT | /api/orders/{id}/status | Admin | Update order status |

## Git Branching Strategy

- `main` - Production-ready code
- `dev` - Development branch (merge PRs here)
- `bugfix/BUG-XXX-description` - Bug fix branches
- `feature/FEAT-XXX-description` - Feature branches

### Workflow:
1. Pull latest `dev` branch
2. Create your branch: `git checkout -b bugfix/BUG-001-description dev`
3. Make changes and commit
4. Push and create Pull Request to `dev`

## Team

| Name | GitHub | Role |
|------|--------|------|
| Pritam | @Pritam-1089 | Admin / Lead |
| Shivani | @Shivani8956 | Developer |
| Mayuri | @mayurivilas7571 | Developer |
