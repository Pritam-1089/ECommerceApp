using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.Auth;

namespace ECommerce.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto);
}
