using EcommerceApi.Data;
using EcommerceApi.Services; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer; // 🆕 Required for default authentication schemas
using Microsoft.IdentityModel.Tokens;               // 🆕 Required for symmetric security keys
using System.Text;

namespace EcommerceApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // 1. Get your MySQL connection string from appsettings.Development.json
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        // 2. Register your MySQL database context into the application services
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        // Add standard controller services
        builder.Services.AddControllers();

        // 3. REGISTER YOUR DEPENDENCY INJECTION SERVICES HERE
        builder.Services.AddScoped<ITokenService, TokenService>();

        // 4. 🆕 REGISTER AUTHENTICATION SCHEMES INTO SERVICE CONTAINER
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    builder.Configuration.GetSection("Jwt:Key").Value!)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero 
            };
        });

        // 5. CONSOLIDATED CORS POLICY: Cleanly handles both potential React development ports
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:5173", "http://localhost:3000") 
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
        
        // Native OpenAPI documentation
        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        // ⚠️ CRITICAL PIPELINE SEQUENCE ORDER CHECK
        app.UseHttpsRedirection();

        // CORS must sit directly below routing utilities but strictly BEFORE authentication/authorization!
        app.UseCors("AllowReactApp");

        // 6. 🆕 PIPELINE INJECTIONS: Authentication MUST run before Authorization
        app.UseAuthentication(); // ◄── Identifies WHO is making the request using your 512-bit token
        app.UseAuthorization();  // ◄── Evaluates IF that identity has permission (e.g., [Authorize] or Admin roles)
        
        app.MapControllers();

        app.Run();
    }
}