using ECommerce.Application.DTOs;
using ECommerce.Core.Entities;

namespace ECommerce.Application.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto dto);
    Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync();
    Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId);
    Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int orderId);
    Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, OrderStatus status);
}
