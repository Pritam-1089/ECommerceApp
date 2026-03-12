using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public override async Task<IReadOnlyList<Product>> GetAllAsync()
    {
        return await _dbSet
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .ToListAsync();
    }


    public async Task<IReadOnlyList<Product>> GetProductsByCategoryAsync(int categoryId) =>
        await _dbSet.Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Category)
            .ToListAsync();

    public async Task<IReadOnlyList<Product>> SearchProductsAsync(string searchTerm) =>
        await _dbSet.Where(p => p.IsActive &&
            (p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm)))
            .Include(p => p.Category)
            .ToListAsync();

    public async Task<Product?> GetProductWithDetailsAsync(int id) =>
        await _dbSet.Where(p => p.Id == id && p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Reviews).ThenInclude(r => r.User)
            .FirstOrDefaultAsync();
}
