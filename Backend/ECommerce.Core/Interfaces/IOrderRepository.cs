using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<IReadOnlyList<Order>> GetOrdersByUserIdAsync(int userId);
    Task<Order?> GetOrderWithDetailsAsync(int orderId);
    Task<Order?> GetOrderByOrderNumberAsync(string orderNumber);
}
