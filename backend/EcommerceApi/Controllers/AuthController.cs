using Microsoft.AspNetCore.Mvc;
using EcommerceApi.DTOs;
using EcommerceApi.Services;
using EcommerceApi.Data; // Assuming your Entity Framework DataContext sits here
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Sets route automatically to /api/auth
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")] // Sets route to /api/auth/login
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // 1. Find user in MySQL database via Entity Framework
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            if (user == null) 
                return Unauthorized("Invalid email address.");

            // 2. Verify password (⚠️ Note: In a production environment, use password hashing like BCrypt!)
            if (user.Password != loginDto.Password) 
                return Unauthorized("Invalid password.");

            // 3. Generate the secure JWT token string using our service
            var tokenString = _tokenService.CreateToken(user);

            // 4. Return an anonymous object matching the exact structure your React app expects!
            return Ok(new {
                token = tokenString,
                user = new {
                    id = user.Id,
                    email = user.Email,
                    fullName = user.FullName,
                    role = user.Role
                }
            });
        }

        [HttpPost("register")] // Route becomes: /api/auth/register
public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
{
    // 1. Check if the email is already taken
    var userExists = await _context.Users
        .AnyAsync(x => x.Email == registerDto.Email.ToLower());

    if (userExists)
        return BadRequest("This email address is already registered.");

    // 2. Map the DTO data over to a brand new User model object
    var newUser = new User
    {
        Email = registerDto.Email.ToLower(),
        Password = registerDto.Password, // ⚠️ In the next step, we should hash this!
        FullName = registerDto.FullName,
        Role = "Customer" // New signups default to standard Customer tier
    };

    // 3. Save the new user row into your MySQL database
    _context.Users.Add(newUser);
    await _context.SaveChangesAsync();

    // 4. Automatically log them in by generating a token for their new account
    var tokenString = _tokenService.CreateToken(newUser);

    return Ok(new {
        token = tokenString,
        user = new {
            id = newUser.Id,
            email = newUser.Email,
            fullName = newUser.FullName,
            role = newUser.Role
        }
    });
}
    }
}