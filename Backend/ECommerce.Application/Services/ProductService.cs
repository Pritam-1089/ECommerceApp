using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepo;

    public ProductService(IProductRepository productRepo)
    {
        _productRepo = productRepo;
    }

    public async Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync()
    {
        var products = await _productRepo.GetAllAsync();
        var dtos = products.Select(MapToDto).ToList();
        return ApiResponse<List<ProductDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id)
    {
        var product = await _productRepo.GetProductWithDetailsAsync(id);
        if (product == null)
            return ApiResponse<ProductDto>.ErrorResponse("Product not found");
        return ApiResponse<ProductDto>.SuccessResponse(MapToDto(product));
    }

    public async Task<ApiResponse<List<ProductDto>>> GetProductsByCategoryAsync(int categoryId)
    {
        var products = await _productRepo.GetProductsByCategoryAsync(categoryId);
        return ApiResponse<List<ProductDto>>.SuccessResponse(products.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<List<ProductDto>>> SearchProductsAsync(string searchTerm)
    {
        var products = await _productRepo.SearchProductsAsync(searchTerm);
        return ApiResponse<List<ProductDto>>.SuccessResponse(products.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            SKU = dto.SKU,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };

        await _productRepo.AddAsync(product);
        return ApiResponse<ProductDto>.SuccessResponse(MapToDto(product), "Product created");
    }

    public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product == null)
            return ApiResponse<ProductDto>.ErrorResponse("Product not found");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl;
        product.CategoryId = dto.CategoryId;

        await _productRepo.UpdateAsync(product);
        return ApiResponse<ProductDto>.SuccessResponse(MapToDto(product), "Product updated");
    }

    public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product == null)
            return ApiResponse<bool>.ErrorResponse("Product not found");

        await _productRepo.DeleteAsync(product);
        return ApiResponse<bool>.SuccessResponse(true, "Product deleted");
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        SKU = p.SKU,
        Price = p.Price,
        DiscountPrice = p.DiscountPrice,
        StockQuantity = p.StockQuantity,
        ImageUrl = p.ImageUrl,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name ?? "",
        AverageRating = p.Reviews?.Any() == true ? p.Reviews.Average(r => r.Rating) : 0,
        ReviewCount = p.Reviews?.Count ?? 0
    };
}
