// 📁 Middleware/ExceptionMiddleware.cs
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace EcommerceApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Move forward down the HTTP pipeline execution path
                await _next(context);
            }
            catch (Exception ex)
            {
                // 🚨 An unhandled exception blew up somewhere in a controller! 
                _logger.LogError(ex, $"A critical server-side crash occurred: {ex.Message}");
                await HandleGlobalExceptionAsync(context, ex);
            }
        }

        private static Task HandleGlobalExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Craft a standardized error payload object structure for your React app to parse
            var errorPayload = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Internal Server pipeline failure. Transaction aborted.",
                Detailed = exception.Message // Keep this enabled during your local development
            };

            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            return context.Response.WriteAsync(JsonSerializer.Serialize(errorPayload, jsonOptions));
        }
    }
}