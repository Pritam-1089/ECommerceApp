using Microsoft.EntityFrameworkCore;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Category>> GetAllWithSubCategoriesAsync()
    {
        return await _context.Categories
            .Where(c => c.ParentCategoryId == null && c.IsActive) // parent categories only
            .Include(c => c.SubCategories.Where(sc => sc.IsActive)) // filter subcategories
            .AsNoTracking()
            .ToListAsync();
    }
}