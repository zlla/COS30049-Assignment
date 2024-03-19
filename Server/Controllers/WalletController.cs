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
    public class WalletController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public WalletController(ApplicationDbContext db, AuthLibrary authLibrary)
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

        [HttpGet("checkWalletExist")]
        public async Task<IActionResult> CheckWalletExist()
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            Wallet? wallet = await _db.Wallets.Where(w => w.UserId == userFromDb.Id).FirstOrDefaultAsync();

            bool walletExists = false;
            if (wallet != null)
            {
                walletExists = true;
                return Ok(walletExists);
            }

            return NotFound(walletExists);
        }

        [HttpPost("createNewWallet")]
        public async Task<IActionResult> CreateNewWallet([FromBody] Wallet wallet)
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            Wallet newWallet = new()
            {
                UserId = userFromDb.Id,
                WalletAddress = wallet.WalletAddress,
                PrivateKey = wallet.PrivateKey,
                Balance = wallet.Balance
            };

            await _db.Wallets.AddAsync(newWallet);
            await _db.SaveChangesAsync();

            return Ok();
        }

    }
}
