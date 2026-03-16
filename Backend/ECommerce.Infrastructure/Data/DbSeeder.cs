using ECommerce.Core.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUserAsync(AppDbContext context)
        {
            try
            {
                var adminEmail = "admin@pavasm.com";

                var adminExists = await context.Users
                    .AnyAsync(u => u.Email == adminEmail);

                if (!adminExists)
                {
                    using var hmac = new HMACSHA512();

                    var passwordHash = Convert.ToBase64String(
                        hmac.ComputeHash(Encoding.UTF8.GetBytes("Admin@123"))
                    );

                    var passwordSalt = Convert.ToBase64String(hmac.Key);
                    var adminUser = new User
                    {
                        Email = adminEmail,
                        FirstName = "Admin",
                        LastName = "User",
                        PasswordHash = passwordHash + "." + passwordSalt,
                        RoleId = 1,
                        Phone = "0000000000",
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    };


                    context.Users.Add(adminUser);
                    await context.SaveChangesAsync();

                    Console.WriteLine("Admin user seeded successfully.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Admin seeding failed: {ex.Message}");
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
    }
}
