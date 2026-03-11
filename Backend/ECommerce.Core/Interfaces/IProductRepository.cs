using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IReadOnlyList<Product>> GetProductsByCategoryAsync(int categoryId);
    Task<IReadOnlyList<Product>> SearchProductsAsync(string searchTerm);
    Task<Product?> GetProductWithDetailsAsync(int id);
}
