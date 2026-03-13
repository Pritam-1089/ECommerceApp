using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "Phone", "RoleId", "UpdatedAt" },
                values: new object[] { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@ecommerce.com", "Admin", true, "User", "tZOBeHHxo1QXurQLCcV8+Kj6tYs8pXMWYxu9fUhPighe/Co2eAt/2SjGleZIrX7ofD7gjJsEnslCgtXbzHmYlQGJgS2sQ1d3eIZKbLQBEtaBN8+JvaPb9XCY3XccttJMIsu2CNR0AMjrIIXJ6YULzpopPOXMcRyq3OmOE/ZgjTA=.wP2mVCjA9rLVSquBDmUAVv3ngUO5DiQtpkGtHi0CuVUi+2z6cyt3Jli+gDBA8pGpW7Tf5ms8awrPB42kHley3Q==", "0000000000", 1, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
