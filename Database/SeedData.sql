-- Run this after EF Migration to seed sample data

-- Categories
SET IDENTITY_INSERT [Categories] ON;
INSERT INTO [Categories] (Id, Name, Description, ImageUrl, ParentCategoryId, CreatedAt, IsActive)
VALUES
(1, 'Electronics', 'Electronic devices and gadgets', '', NULL, GETUTCDATE(), 1),
(2, 'Clothing', 'Men and Women clothing', '', NULL, GETUTCDATE(), 1),
(3, 'Books', 'All types of books', '', NULL, GETUTCDATE(), 1),
(4, 'Home & Kitchen', 'Home appliances and kitchen items', '', NULL, GETUTCDATE(), 1),
(5, 'Mobiles', 'Smartphones and accessories', '', 1, GETUTCDATE(), 1),
(6, 'Laptops', 'Laptops and tablets', '', 1, GETUTCDATE(), 1);
SET IDENTITY_INSERT [Categories] OFF;

-- Products
SET IDENTITY_INSERT [Products] ON;
INSERT INTO [Products] (Id, Name, Description, SKU, Price, DiscountPrice, StockQuantity, ImageUrl, CategoryId, CreatedAt, IsActive)
VALUES
(1, 'iPhone 15 Pro', '256GB, Titanium Design, A17 Pro chip', 'IP15PRO-256', 134900, 129900, 50, 'https://placehold.co/300x200?text=iPhone+15', 5, GETUTCDATE(), 1),
(2, 'Samsung Galaxy S24', '128GB, AI Features, Dynamic AMOLED', 'SGS24-128', 79999, 74999, 35, 'https://placehold.co/300x200?text=Galaxy+S24', 5, GETUTCDATE(), 1),
(3, 'MacBook Air M3', '8GB RAM, 256GB SSD, 15 inch', 'MBA-M3-256', 134900, NULL, 20, 'https://placehold.co/300x200?text=MacBook+Air', 6, GETUTCDATE(), 1),
(4, 'Dell XPS 15', '16GB RAM, 512GB SSD, Intel i7', 'DXPS15-512', 149990, 139990, 15, 'https://placehold.co/300x200?text=Dell+XPS', 6, GETUTCDATE(), 1),
(5, 'Men Casual Shirt', 'Cotton slim fit casual shirt', 'MCS-BLU-L', 1499, 999, 100, 'https://placehold.co/300x200?text=Casual+Shirt', 2, GETUTCDATE(), 1),
(6, 'Women Kurti Set', 'Embroidered cotton kurti with dupatta', 'WKS-RED-M', 2499, 1799, 80, 'https://placehold.co/300x200?text=Kurti+Set', 2, GETUTCDATE(), 1),
(7, 'Clean Code by Robert C. Martin', 'A handbook of agile software craftsmanship', 'BK-CC-001', 599, 449, 200, 'https://placehold.co/300x200?text=Clean+Code', 3, GETUTCDATE(), 1),
(8, 'Prestige Induction Cooktop', '1600W, Push button, Indian menu', 'PIC-1600', 2999, 2499, 40, 'https://placehold.co/300x200?text=Induction', 4, GETUTCDATE(), 1);
SET IDENTITY_INSERT [Products] OFF;

-- Admin User (password: Admin@123)
-- Note: Run the Register API to create admin, then update RoleId manually:
-- UPDATE Users SET RoleId = 1 WHERE Email = 'admin@shopease.com';
