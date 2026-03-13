using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<IReadOnlyList<User>> GetAllUsersWithRolesAsync();
}
