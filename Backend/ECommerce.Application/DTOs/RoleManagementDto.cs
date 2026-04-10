using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.DTOs;

public class UpdateUserRoleDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int RoleId { get; set; }
}
    public class UserWithRoleDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
