// 📁 Models/Order.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceApi.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // Relationship: One Order maps to many specific bought items
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}