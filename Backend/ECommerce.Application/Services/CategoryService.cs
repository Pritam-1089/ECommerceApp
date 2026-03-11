using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IGenericRepository<Category> _categoryRepo;

    public CategoryService(IGenericRepository<Category> categoryRepo)
    {
        _categoryRepo = categoryRepo;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepo.GetAllAsync();
        var dtos = categories.Select(MapToDto).ToList();
        return ApiResponse<List<CategoryDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.ErrorResponse("Category not found");
        return ApiResponse<CategoryDto>.SuccessResponse(MapToDto(category));
    }

    public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            ParentCategoryId = dto.ParentCategoryId
        };

        await _categoryRepo.AddAsync(category);
        return ApiResponse<CategoryDto>.SuccessResponse(MapToDto(category), "Category created");
    }

    public async Task<ApiResponse<bool>> DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<bool>.ErrorResponse("Category not found");

        await _categoryRepo.DeleteAsync(category);
        return ApiResponse<bool>.SuccessResponse(true, "Category deleted");
    }

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Description = c.Description,
        ImageUrl = c.ImageUrl,
        ParentCategoryId = c.ParentCategoryId,
        SubCategories = c.SubCategories?.Select(MapToDto).ToList() ?? new()
    };
}
