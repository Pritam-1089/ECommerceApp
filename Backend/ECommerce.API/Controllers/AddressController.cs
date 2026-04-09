using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace ECommerce.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AddressController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAddresses() =>
        Ok(await _addressService.GetUserAddressesAsync(GetUserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAddress(int id)
    {
        var result = await _addressService.GetAddressByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto dto) =>
        Ok(await _addressService.AddAddressAsync(GetUserId(), dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(int id, [FromBody] CreateAddressDto dto)
    {
        var result = await _addressService.UpdateAddressAsync(GetUserId(), id, dto);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var result = await _addressService.DeleteAddressAsync(GetUserId(), id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("pincode/{pincode}")]
    public async Task<IActionResult> GetAddressByPincode(string pincode)
    {
        using var client = new HttpClient();

        var response = await client.GetAsync($"https://api.postalpincode.in/pincode/{pincode}");

        var stream = await response.Content.ReadAsStreamAsync();

        var json = await JsonSerializer.DeserializeAsync<object>(stream);

        return Ok(json);
    }


}
