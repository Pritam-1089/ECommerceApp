using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ECommerce.Application.DTOs;
using ECommerce.Application.DTOs.Auth;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ECommerce.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IGenericRepository<Role> _roleRepo;
    private readonly IConfiguration _config;

    public AuthService(IUserRepository userRepo, IGenericRepository<Role> roleRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _roleRepo = roleRepo;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        if (await _userRepo.EmailExistsAsync(dto.Email))
            return ApiResponse<AuthResponseDto>.ErrorResponse("Email already exists");

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = HashPassword(dto.Password),
            RoleId = 2 // Customer
        };

        await _userRepo.AddAsync(user);
        var dbUser = await _userRepo.GetByEmailAsync(user.Email);

        return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
        {
            Token = GenerateJwtToken(dbUser!),
            Email = dbUser!.Email,
            FullName = $"{dbUser.FirstName} {dbUser.LastName}",
            Role = dbUser.Role.Name
        }, "Registration successful");
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAdminAsync(RegisterDto dto)
    {
        if (await _userRepo.EmailExistsAsync(dto.Email))
            return ApiResponse<AuthResponseDto>.ErrorResponse("Email already exists");

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = HashPassword(dto.Password),
            RoleId = 1 // Admin
        };

        await _userRepo.AddAsync(user);
        var dbUser = await _userRepo.GetByEmailAsync(user.Email);

        return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
        {
            Token = GenerateJwtToken(dbUser!),
            Email = dbUser!.Email,
            FullName = $"{dbUser.FirstName} {dbUser.LastName}",
            Role = dbUser.Role.Name
        }, "Admin registration successful");
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password");

        return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
        {
            Token = GenerateJwtToken(user),
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role = user.Role.Name
        }, "Login successful");
    }

    public async Task<ApiResponse<List<UserWithRoleDto>>> GetAllUsersAsync()
    {
        var users = await _userRepo.GetAllUsersWithRolesAsync();
        var dtos = users.Select(u => new UserWithRoleDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role?.Name ?? "",
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        }).ToList();
        return ApiResponse<List<UserWithRoleDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<bool>> UpdateUserRoleAsync(int userId, UpdateUserRoleDto dto, int currentUserId)
    {
        if (userId == currentUserId)
            return ApiResponse<bool>.ErrorResponse("Cannot change your own role");

        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<bool>.ErrorResponse("User not found");

        var role = await _roleRepo.GetByIdAsync(dto.RoleId);
        if (role == null)
            return ApiResponse<bool>.ErrorResponse("Invalid role");

        user.RoleId = dto.RoleId;
        await _userRepo.UpdateAsync(user);
        return ApiResponse<bool>.SuccessResponse(true, "User role updated successfully");
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role.Name)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        using var hmac = new HMACSHA512();
        var salt = hmac.Key;
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split('.');
        if (parts.Length != 2) return false;
        var salt = Convert.FromBase64String(parts[0]);
        var hash = Convert.FromBase64String(parts[1]);
        using var hmac = new HMACSHA512(salt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(hash);
    }
}
