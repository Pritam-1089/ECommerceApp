using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class AddressService : IAddressService
{
    private readonly IGenericRepository<Address> _addressRepo;

    public AddressService(IGenericRepository<Address> addressRepo)
    {
        _addressRepo = addressRepo;
    }

    public async Task<ApiResponse<List<AddressDto>>> GetUserAddressesAsync(int userId)
    {
        var addresses = await _addressRepo.FindAsync(a => a.UserId == userId && a.IsActive);
        var dtos = addresses.Select(MapToDto).ToList();
        return ApiResponse<List<AddressDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<AddressDto>> GetAddressByIdAsync(int id)
    {
        var address = await _addressRepo.GetByIdAsync(id);
        if (address == null)
            return ApiResponse<AddressDto>.ErrorResponse("Address not found");
        return ApiResponse<AddressDto>.SuccessResponse(MapToDto(address));
    }

    public async Task<ApiResponse<AddressDto>> AddAddressAsync(int userId, CreateAddressDto dto)
    {
        var address = new Address
        {
            UserId = userId,
            FullName = dto.FullName,
            Phone = dto.Phone,
            AddressLine1 = dto.AddressLine1,
            AddressLine2 = dto.AddressLine2,
            City = dto.City,
            State = dto.State,
            PostalCode = dto.PostalCode,
            Country = dto.Country,
            IsDefault = dto.IsDefault
        };

        await _addressRepo.AddAsync(address);
        return ApiResponse<AddressDto>.SuccessResponse(MapToDto(address), "Address added");
    }

    public async Task<ApiResponse<AddressDto>> UpdateAddressAsync(int userId, int id, CreateAddressDto dto)
    {
        var address = await _addressRepo.GetByIdAsync(id);
        if (address == null || address.UserId != userId)
            return ApiResponse<AddressDto>.ErrorResponse("Address not found");

        address.FullName = dto.FullName;
        address.Phone = dto.Phone;
        address.AddressLine1 = dto.AddressLine1;
        address.AddressLine2 = dto.AddressLine2;
        address.City = dto.City;
        address.State = dto.State;
        address.PostalCode = dto.PostalCode;
        address.Country = dto.Country;
        address.IsDefault = dto.IsDefault;

        await _addressRepo.UpdateAsync(address);
        return ApiResponse<AddressDto>.SuccessResponse(MapToDto(address), "Address updated");
    }

    public async Task<ApiResponse<bool>> DeleteAddressAsync(int userId, int id)
    {
        var address = await _addressRepo.GetByIdAsync(id);
        if (address == null || address.UserId != userId)
            return ApiResponse<bool>.ErrorResponse("Address not found");

        await _addressRepo.DeleteAsync(address);
        return ApiResponse<bool>.SuccessResponse(true, "Address deleted");
    }

    private static AddressDto MapToDto(Address a) => new()
    {
        Id = a.Id,
        FullName = a.FullName,
        Phone = a.Phone,
        AddressLine1 = a.AddressLine1,
        AddressLine2 = a.AddressLine2,
        City = a.City,
        State = a.State,
        PostalCode = a.PostalCode,
        Country = a.Country,
        IsDefault = a.IsDefault
    };
}
