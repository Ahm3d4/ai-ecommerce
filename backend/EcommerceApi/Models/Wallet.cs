// 📁 Models/Wallet.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EcommerceApi.Models
{
    public class Wallet
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0.00m;

        // Foreign Key linking back to the User
        public int UserId { get; set; }

        [JsonIgnore] // Prevents circular reference loops during JSON serialization
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}