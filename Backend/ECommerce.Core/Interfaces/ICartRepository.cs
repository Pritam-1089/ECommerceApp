using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces;

public interface ICartRepository
{
    Task<Cart?> GetCartByUserIdAsync(int userId);
    Task<Cart> CreateCartAsync(int userId);
    Task AddCartItemAsync(CartItem item);
    Task UpdateCartItemAsync(CartItem item);
    Task RemoveCartItemAsync(CartItem item);
    Task ClearCartAsync(Cart cart);
    Task SaveChangesAsync();
}
