using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class SystemCoin
    {
        [Key]
        public required string Id { get; set; }
        [Required]
        public required string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public required ulong Price { get; set; }
        public virtual Asset? Asset { get; set; }
    }
}