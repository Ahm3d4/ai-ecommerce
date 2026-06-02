// 📁 Controllers/WalletsController.cs
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
    [Authorize] // Must be logged in to touch your wallet
    public class WalletsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WalletsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserIdFromToken() => 
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // 1. GET CURRENT WALLET PROFILE
        [HttpGet]
        public async Task<IActionResult> GetWallet()
        {
            var userId = GetUserIdFromToken();
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);

            // If a user logs in but doesn't have a wallet row yet, create one on the fly
            if (wallet == null)
            {
                wallet = new Wallet { UserId = userId, Balance = 0.00m };
                _context.Wallets.Add(wallet);
                await _context.SaveChangesAsync();
            }

            return Ok(wallet);
        }

        // 2. DEPOSIT FUNDS
        [HttpPost("deposit")]
public async Task<IActionResult> DepositFunds([FromBody] DepositDto dto)
{
    if (dto.Amount <= 0) return BadRequest("Deposit amount must be positive.");

    var userId = GetUserIdFromToken();
    
    // 1. Look for the user's wallet
    var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);

    // 2. 🆕 FIX: If it's null, create it on the fly instead of crashing!
    if (wallet == null)
    {
        wallet = new Wallet { UserId = userId, Balance = 0.00m };
        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync(); // Save it first to get an identity ID
    }

    // 3. Add the money
    wallet.Balance += dto.Amount;
    await _context.SaveChangesAsync();

    return Ok(wallet);
}
    }

    public class DepositDto
    {
        public decimal Amount { get; set; }
    }
}