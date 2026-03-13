using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var result = await _orderService.CreateOrderAsync(GetUserId(), dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders() =>
        Ok(await _orderService.GetUserOrdersAsync(GetUserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var result = await _orderService.GetOrderByIdAsync(id);

        if (!result.Success)
            return NotFound(result);

        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");

        if (result.Data.UserId != userId && !isAdmin)
            return Forbid();

        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus status)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, status);
        return result.Success ? Ok(result) : NotFound(result);
    }
}