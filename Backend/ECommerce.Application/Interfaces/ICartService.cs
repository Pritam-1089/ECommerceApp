using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface ICartService
{
    Task<ApiResponse<CartDto>> GetCartAsync(int userId);
    Task<ApiResponse<CartDto>> AddToCartAsync(int userId, AddToCartDto dto);
    Task<ApiResponse<CartDto>> UpdateCartItemAsync(int userId, int cartItemId, int quantity);
    Task<ApiResponse<bool>> RemoveFromCartAsync(int userId, int cartItemId);
    Task<ApiResponse<bool>> ClearCartAsync(int userId);
}
