using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IAddressService
{
    Task<ApiResponse<List<AddressDto>>> GetUserAddressesAsync(int userId);
    Task<ApiResponse<AddressDto>> GetAddressByIdAsync(int id);
    Task<ApiResponse<AddressDto>> AddAddressAsync(int userId, CreateAddressDto dto);
    Task<ApiResponse<AddressDto>> UpdateAddressAsync(int userId, int id, CreateAddressDto dto);
    Task<ApiResponse<bool>> DeleteAddressAsync(int userId, int id);
}
