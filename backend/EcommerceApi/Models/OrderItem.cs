// 📁 Models/OrderItem.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EcommerceApi.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }
        
        [JsonIgnore] // Prevents nested serialization loops back to the parent order
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        public int ProductId { get; set; }
        
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public int Quantity { get; set; }

        // Snapshotting the price guarantees invoices remain historically accurate 
        // if product prices change down the road
        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAtPurchase { get; set; }
    }
}