using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly ICartRepository _cartRepo;
    private readonly IProductRepository _productRepo;

    public OrderService(IOrderRepository orderRepo, ICartRepository cartRepo, IProductRepository productRepo)
    {
        _orderRepo = orderRepo;
        _cartRepo = cartRepo;
        _productRepo = productRepo;
    }

    public async Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto dto)
    {
        var cart = await _cartRepo.GetCartByUserIdAsync(userId);
        if (cart == null || !cart.CartItems.Any())
            return ApiResponse<OrderDto>.ErrorResponse("Cart is empty");

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
            UserId = userId,
            ShippingAddressId = dto.ShippingAddressId,
            Status = OrderStatus.Pending,
            OrderItems = cart.CartItems.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                UnitPrice = ci.Product.DiscountPrice ?? ci.Product.Price,
                TotalPrice = (ci.Product.DiscountPrice ?? ci.Product.Price) * ci.Quantity
            }).ToList()
        };

        order.TotalAmount = order.OrderItems.Sum(oi => oi.TotalPrice);

        order.Payment = new Payment
        {
            TransactionId = $"TXN-{Guid.NewGuid().ToString()[..12].ToUpper()}",
            Amount = order.TotalAmount,
            Method = dto.PaymentMethod,
            Status = PaymentStatus.Pending
        };

        // STEP 1: Validate stock BEFORE creating order
        foreach (var item in cart.CartItems)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId);

            if (product == null)
            {
                return ApiResponse<OrderDto>.ErrorResponse("Product not found");
            }

            if (product.StockQuantity < item.Quantity)
            {
                return ApiResponse<OrderDto>.ErrorResponse(
                    $"Not enough stock for {product.Name}. Available: {product.StockQuantity}"
                );
            }
        }
        // STEP 2: Reduce stock AFTER validation
foreach (var item in cart.CartItems)
{
    var product = await _productRepo.GetByIdAsync(item.ProductId);

    product!.StockQuantity -= item.Quantity;

    await _productRepo.UpdateAsync(product);
}

        await _orderRepo.AddAsync(order);
        await _cartRepo.ClearCartAsync(cart);

        return ApiResponse<OrderDto>.SuccessResponse(MapToDto(order), "Order placed successfully");
    }

    public async Task<ApiResponse<List<OrderDto>>> GetAllOrdersAsync()
    {
        var orders = await _orderRepo.GetAllOrdersAsync();
        return ApiResponse<List<OrderDto>>.SuccessResponse(orders.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId)
    {
        var orders = await _orderRepo.GetOrdersByUserIdAsync(userId);
        return ApiResponse<List<OrderDto>>.SuccessResponse(orders.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<OrderDto>> GetOrderByIdAsync(int orderId)
    {
        var order = await _orderRepo.GetOrderWithDetailsAsync(orderId);
        if (order == null)
            return ApiResponse<OrderDto>.ErrorResponse("Order not found");
        return ApiResponse<OrderDto>.SuccessResponse(MapToDto(order));
    }

    private static readonly Dictionary<OrderStatus, OrderStatus[]> _validTransitions = new()
    {
        { OrderStatus.Pending, new[] { OrderStatus.Confirmed, OrderStatus.Cancelled } },
        { OrderStatus.Confirmed, new[] { OrderStatus.Processing, OrderStatus.Cancelled } },
        { OrderStatus.Processing, new[] { OrderStatus.Shipped, OrderStatus.Cancelled } },
        { OrderStatus.Shipped, new[] { OrderStatus.Delivered } },
        { OrderStatus.Delivered, new[] { OrderStatus.Returned } },
    };

    public async Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        var order = await _orderRepo.GetOrderWithDetailsAsync(orderId);
        if (order == null)
            return ApiResponse<OrderDto>.ErrorResponse("Order not found");

        if (!_validTransitions.ContainsKey(order.Status) ||
            !_validTransitions[order.Status].Contains(status))
            return ApiResponse<OrderDto>.ErrorResponse(
                $"Invalid status transition from {order.Status} to {status}");

        order.Status = status;
        await _orderRepo.UpdateAsync(order);
        return ApiResponse<OrderDto>.SuccessResponse(MapToDto(order), "Status updated");
    }

    private static OrderDto MapToDto(Order order) => new()
    {
        Id = order.Id,
        UserId = order.UserId,   // ADD THIS

        OrderNumber = order.OrderNumber,
        TotalAmount = order.TotalAmount,
        Status = order.Status.ToString(),
        CreatedAt = order.CreatedAt,

        Items = order.OrderItems?.Select(oi => new OrderItemDto
        {
            ProductId = oi.ProductId,
            ProductName = oi.Product?.Name ?? "",
            ProductImage = oi.Product?.ImageUrl ?? "",
            Quantity = oi.Quantity,
            UnitPrice = oi.UnitPrice,
            TotalPrice = oi.TotalPrice
        }).ToList() ?? new()
    };
}
