using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetCart() =>
        Ok(await _cartService.GetCartAsync(GetUserId()));

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto) =>
        Ok(await _cartService.AddToCartAsync(GetUserId(), dto));

    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateItem(int cartItemId, [FromBody] int quantity) =>
        Ok(await _cartService.UpdateCartItemAsync(GetUserId(), cartItemId, quantity));

    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var result = await _cartService.RemoveFromCartAsync(GetUserId(), cartItemId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart() =>
        Ok(await _cartService.ClearCartAsync(GetUserId()));
}
