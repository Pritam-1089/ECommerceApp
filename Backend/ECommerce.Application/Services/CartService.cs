using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepo;
    private readonly IProductRepository _productRepo;

    public CartService(ICartRepository cartRepo, IProductRepository productRepo)
    {
        _cartRepo = cartRepo;
        _productRepo = productRepo;
    }

    public async Task<ApiResponse<CartDto>> GetCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart));
    }

    public async Task<ApiResponse<CartDto>> AddToCartAsync(int userId, AddToCartDto dto)
    {
        var product = await _productRepo.GetByIdAsync(dto.ProductId);
        if (product == null)
            return ApiResponse<CartDto>.ErrorResponse("Product not found");

        var cart = await GetOrCreateCartAsync(userId);
        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);

        var totalQty = (existingItem?.Quantity ?? 0) + dto.Quantity;
        if (product.StockQuantity < totalQty)
            return ApiResponse<CartDto>.ErrorResponse($"Insufficient stock. Available: {product.StockQuantity}, In cart: {existingItem?.Quantity ?? 0}");

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
            await _cartRepo.UpdateCartItemAsync(existingItem);
        }
        else
        {
            var cartItem = new CartItem { CartId = cart.Id, ProductId = dto.ProductId, Quantity = dto.Quantity };
            await _cartRepo.AddCartItemAsync(cartItem);
        }

        cart = await GetOrCreateCartAsync(userId);
        return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart), "Item added to cart");
    }

    public async Task<ApiResponse<CartDto>> UpdateCartItemAsync(int userId, int cartItemId, int quantity)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var item = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (item == null)
            return ApiResponse<CartDto>.ErrorResponse("Cart item not found");

        item.Quantity = quantity;
        await _cartRepo.UpdateCartItemAsync(item);
        cart = await GetOrCreateCartAsync(userId);
        return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart));
    }

    public async Task<ApiResponse<bool>> RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var item = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (item == null)
            return ApiResponse<bool>.ErrorResponse("Cart item not found");

        await _cartRepo.RemoveCartItemAsync(item);
        return ApiResponse<bool>.SuccessResponse(true, "Item removed");
    }

    public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        await _cartRepo.ClearCartAsync(cart);
        return ApiResponse<bool>.SuccessResponse(true, "Cart cleared");
    }

    private async Task<Cart> GetOrCreateCartAsync(int userId)
    {
        var cart = await _cartRepo.GetCartByUserIdAsync(userId);
        if (cart == null)
            cart = await _cartRepo.CreateCartAsync(userId);
        return cart;
    }

    private static CartDto MapToDto(Cart cart) => new()
    {
        Id = cart.Id,
        Items = cart.CartItems.Where(ci => ci.Product != null).Select(ci => new CartItemDto
        {
            Id = ci.Id,
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            ProductImage = ci.Product.ImageUrl,
            Price = ci.Product.DiscountPrice ?? ci.Product.Price,
            Quantity = ci.Quantity,
            TotalPrice = (ci.Product.DiscountPrice ?? ci.Product.Price) * ci.Quantity
        }).ToList(),
        TotalAmount = cart.CartItems.Where(ci => ci.Product != null)
            .Sum(ci => (ci.Product.DiscountPrice ?? ci.Product.Price) * ci.Quantity)
    };
}
