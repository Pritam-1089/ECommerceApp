using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Order>> GetAllOrdersAsync() =>
        await _dbSet.Where(o => o.IsActive)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<IReadOnlyList<Order>> GetOrdersByUserIdAsync(int userId) =>
        await _dbSet.Where(o => o.UserId == userId && o.IsActive)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<Order?> GetOrderWithDetailsAsync(int orderId) =>
        await _dbSet.Where(o => o.Id == orderId)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync();

    public async Task<Order?> GetOrderByOrderNumberAsync(string orderNumber) =>
        await _dbSet.Where(o => o.OrderNumber == orderNumber)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync();
}
