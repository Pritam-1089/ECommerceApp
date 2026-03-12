using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IReadOnlyList<Category>> GetAllWithSubCategoriesAsync();
}