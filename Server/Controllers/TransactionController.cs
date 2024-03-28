using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Auth;
using Server.Helpers;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;
        public TransactionController(ApplicationDbContext db, AuthLibrary authLibrary)
        {
            _db = db;
            _authLibrary = authLibrary;
        }

        private async Task<User?> GetUserFromAccessToken()
        {
            // Get the access token from the authorization header
            string? accessToken = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(accessToken))
            {
                BadRequest("Access token is required");
                return null;
            }

            var principal = _authLibrary.Validate(accessToken);

            if (principal == null)
            {
                BadRequest("Invalid access token");
                return null;
            }

            // Get the user's name from the access token claims
            string? username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
            {
                BadRequest("Invalid username");
                return null;
            }

            // Get the user from the database by name
            User? userFromDb = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            return userFromDb;
        }

        [HttpPost]
        public async Task<IActionResult> NewTransaction([FromBody] Request request)
        {
            Transaction newTransaction = new()
            {
                AssetId = request.AssetId,
                From = request.From,
                To = request.To,
                Amount = request.Amount,
                TotalPrice = request.TotalPrice,
                TransactionType = request.TransactionType
            };

            _db.Transactions.Add(newTransaction);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }

    public class Request
    {

        public required string AssetId { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required string Amount { get; set; }
        public required string TotalPrice { get; set; }
        public required string TransactionType { get; set; }
    }
}