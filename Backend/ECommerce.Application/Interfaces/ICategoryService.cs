using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync();
    Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto);
    Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int id, CreateCategoryDto dto);
}
