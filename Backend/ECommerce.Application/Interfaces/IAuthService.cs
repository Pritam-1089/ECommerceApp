using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.Auth;

namespace ECommerce.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<AuthResponseDto>> RegisterAdminAsync(RegisterDto dto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto);
    Task<ApiResponse<List<UserWithRoleDto>>> GetAllUsersAsync();
    Task<ApiResponse<bool>> UpdateUserRoleAsync(int userId, UpdateUserRoleDto dto, int currentUserId);
}
