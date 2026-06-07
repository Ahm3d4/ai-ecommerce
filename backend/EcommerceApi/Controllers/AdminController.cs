// 📁 Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EcommerceApi.Data;
using EcommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")] // 🛡️ Strict guard: blocks non-admin account tokens at the firewall
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("restock")]
        public async Task<IActionResult> RestockProduct([FromBody] RestockDto dto)
        {
            if (dto.QuantityToAdd <= 0)
                return BadRequest(new { message = "Restock inventory count must be greater than zero." });

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return NotFound(new { message = "Target product component missing from database ledger." });

            // 🆕 Modify the tracking column attribute in memory
            product.StockQuantity += dto.QuantityToAdd;

            // Commit the update securely down to your MySQL instance
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = $"Successfully restocked {product.Name}.", 
                productId = product.Id, 
                newStock = product.StockQuantity 
            });
        }
        [HttpPost]
public async Task<IActionResult> AddProduct([FromBody] Product newProduct)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    _context.Products.Add(newProduct);
    await _context.SaveChangesAsync();

    // 🟩 FIX: Change CreatedAtAction to a clean Ok object status payload
    return Ok(new { 
        message = $"Successfully added '{newProduct.Name}' to the store catalog.",
        product = newProduct 
    });
}
[HttpDelete("{id}")] 
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Target product component missing from ledger." });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully purged '{product.Name}' from warehouse records." });
        }

        
    }

    public class RestockDto
    {
        public int ProductId { get; set; }
        public int QuantityToAdd { get; set; }
    }
}