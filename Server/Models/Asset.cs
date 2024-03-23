using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Asset
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public required long WalletId { get; set; }
        [Required]
        public required string CoinId { get; set; }
        [Required]
        public required ulong Amount { get; set; }
        public virtual Wallet? Wallet { get; set; }
    }
}