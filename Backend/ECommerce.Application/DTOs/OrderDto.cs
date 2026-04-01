using ECommerce.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class OrderDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string OrderNumber { get; set; } = "";

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "";

    public DateTime CreatedAt { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}
public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateOrderDto
{
    [Required(ErrorMessage = "Shipping address is required")]
    public int ShippingAddressId { get; set; }

    [Required(ErrorMessage = "Payment method is required")]
    public PaymentMethod PaymentMethod { get; set; }

    [Required(ErrorMessage = "At least one product is required")]
    public List<int> ProductIds { get; set; } = new List<int>();

    [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be positive")]
    public decimal TotalAmount { get; set; }
}
public class CartDto
{
    public int Id { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
}

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
