using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Transaction
    {
        [Key]
        public long Id { get; set; }
        public required string AssetId { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required string Amount { get; set; }
        public required string TotalPrice { get; set; }
        public required string TransactionType { get; set; }
    }
}