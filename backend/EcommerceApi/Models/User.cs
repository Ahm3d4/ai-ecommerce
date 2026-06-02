using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Models
{
    public class User
    {
        [Key] // Tells Entity Framework this is the primary key (Auto-Incrementing ID)
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty; // ⚠️ Stored plain text for now, we will hash this later!

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "Customer"; // Defaults to standard Customer tier

        public Wallet? Wallet { get; set; }
    }
}