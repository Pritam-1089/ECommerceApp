using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _dbSet.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

    public async Task<bool> EmailExistsAsync(string email) =>
    await _context.Users.AnyAsync(u => u.Email == email && u.IsActive);

}
