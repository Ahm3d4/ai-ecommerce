using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EcommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CreatedAt", "Description", "ImageUrl", "Name", "Price", "StockQuantity" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 5, 19, 13, 43, 21, 792, DateTimeKind.Utc).AddTicks(7969), "Hot-swappable RGB mechanical keyboard with linear switches.", "https://images.unsplash.com/photo-1587829741301-dc798b83add3", "Mechanical Keyboard", 299.00m, 50 },
                    { 2, new DateTime(2026, 5, 19, 13, 43, 21, 793, DateTimeKind.Utc).AddTicks(533), "Ultra-lightweight 2.4GHz wireless mouse with 26K DPI sensor.", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7", "Wireless Gaming Mouse", 180.00m, 120 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
