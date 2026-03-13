using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAuthService _authService;

    public AdminController(IAuthService authService)
    {
        _authService = authService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers() =>
        Ok(await _authService.GetAllUsersAsync());

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
    {
        var result = await _authService.UpdateUserRoleAsync(id, dto, GetUserId());
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
