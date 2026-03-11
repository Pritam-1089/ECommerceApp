using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IProductService
{
    Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync();
    Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id);
    Task<ApiResponse<List<ProductDto>>> GetProductsByCategoryAsync(int categoryId);
    Task<ApiResponse<List<ProductDto>>> SearchProductsAsync(string searchTerm);
    Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto dto);
    Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<ApiResponse<bool>> DeleteProductAsync(int id);
}
