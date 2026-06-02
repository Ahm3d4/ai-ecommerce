using EcommerceApi.Models; // Assuming you have a User model class

namespace EcommerceApi.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}