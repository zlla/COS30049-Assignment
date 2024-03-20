using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Wallet
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required long UserId { get; set; }
        [Required]
        public required string WalletAddress { get; set; }
        public string? PrivateKey { get; set; }
        [Required]
        public required string Balance { get; set; }
        public virtual User? User { get; set; }
        public virtual ICollection<Asset>? Assets { get; set; }
    }
}