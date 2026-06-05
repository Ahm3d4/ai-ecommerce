// 📁 Controllers/CheckoutController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EcommerceApi.Data;
using EcommerceApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EcommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Must possess a valid JWT session to place an order
    public class CheckoutController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckoutController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserIdFromToken() => 
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpPost]
        public async Task<IActionResult> ProcessCheckout([FromBody] List<CartItemDto> cartItems)
        {
            if (cartItems == null || !cartItems.Any()) 
                return BadRequest("Your shopping basket is completely empty.");

            var userId = GetUserIdFromToken();

            // 🆕 CRITICAL SECURITY FEATURE: Open a physical Database Transaction!
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Fetch user's active wallet balance details
                var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
                if (wallet == null) return BadRequest("Wallet context not initialized.");

                decimal grandTotal = 0;
                var orderItemsToCreate = new List<OrderItem>();

                // 2. Map through incoming items and validate stock statuses
                foreach (var item in cartItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) 
                        return NotFound($"Product reference ID {item.ProductId} no longer exists.");

                    if (product.StockQuantity < item.Quantity)
                        return BadRequest($"Insufficient stock for {product.Name}. Available units: {product.StockQuantity}");

                    // Calculate individual metrics
                    grandTotal += product.Price * item.Quantity;

                    // Deduct stock quantities directly from inventory columns
                    product.StockQuantity -= item.Quantity;

                    // Build out the order sub-receipt entry
                    orderItemsToCreate.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        PriceAtPurchase = product.Price
                    });
                }

                // 3. Financial solvency check
                if (wallet.Balance < grandTotal)
                    return BadRequest($"Insufficient wallet balance. Total required: ${grandTotal}. Your balance: ${wallet.Balance}");

                // 4. Deduct capital funds from user's synchronized wallet balance
                wallet.Balance -= grandTotal;

                // 5. Generate parent Order Record invoice
                var newOrder = new Order
                {
                    UserId = userId,
                    TotalAmount = grandTotal,
                    OrderItems = orderItemsToCreate
                };

                _context.Orders.Add(newOrder);

                // Save all atomic alterations down to MySQL tables concurrently
                await _context.SaveChangesAsync();

                // 🚀 If everything clears beautifully, lock the records down permanently!
                await transaction.CommitAsync();

                return Ok(new { message = "Checkout processed successfully!", orderId = newOrder.Id, newBalance = wallet.Balance });
            }
            catch (Exception ex)
            {
                // 🛑 If ANY line code fails or network connection cuts, roll back every state alteration!
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred during transaction checkout handling: {ex.Message}");
            }
        }
        // 📁 Controllers/CheckoutController.cs -> Add inside the CheckoutController class

            [HttpGet("history")]
public async Task<IActionResult> GetOrderHistory()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    if (userId == 0) return Unauthorized("Invalid user session.");

    var orders = await _context.Orders
        .Where(o => o.UserId == userId)
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
        .OrderByDescending(o => o.OrderDate)
        .ToListAsync();

    // 🆕 FORCE EXPLICIT RETURN: If null or empty, send a clean JSON array structure back!
    if (orders == null || !orders.Any())
    {
        return Ok(new List<Order>()); 
    }

    return Ok(orders);
}
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}