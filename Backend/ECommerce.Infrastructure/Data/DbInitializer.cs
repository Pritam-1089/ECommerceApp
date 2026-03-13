using System.Security.Cryptography;
using System.Text;
using ECommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAdminAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync(u => u.Email == "admin@ecommerce.com"))
            return;

        var admin = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@ecommerce.com",
            PasswordHash = HashPassword("Admin@123"),
            Phone = "0000000000",
            RoleId = 1,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }

    private static string HashPassword(string password)
    {
        using var hmac = new HMACSHA512();
        var salt = hmac.Key;
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }
}
