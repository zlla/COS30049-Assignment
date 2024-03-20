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
    [Route("/api/[controller]")]
    [Authorize]
    public class AssetController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public AssetController(ApplicationDbContext db, AuthLibrary authLibrary)
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

        [HttpGet("checkAssetExist")]
        public async Task<IActionResult> CheckAssetExist(string coinId)
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            Wallet? wallet = await _db.Wallets.Where(w => w.UserId == userFromDb.Id).FirstOrDefaultAsync();
            if (wallet == null) return NotFound("Wallet Not Exist");

            bool status = false;
            Asset? asset = await _db.Assets.Where(a => a.CoinId == coinId && a.WalletId == wallet.Id).FirstOrDefaultAsync();

            return asset == null ? Ok(status) : Ok(status = true);
        }

        [HttpPost("newAsset")]
        public async Task<IActionResult> NewAsset([FromBody] Asset asset)
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            Wallet? wallet = await _db.Wallets.Where(w => w.UserId == userFromDb.Id).FirstOrDefaultAsync();
            if (wallet == null) return NotFound("Wallet Not Exist");

            Asset newAsset = new()
            {
                WalletId = wallet.Id,
                CoinId = asset.CoinId,
                Amount = asset.Amount
            };

            await _db.AddAsync(newAsset);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("updateAmountOfAsset")]
        public async Task<IActionResult> UpdateAmountOfAsset([FromBody] UpdateAmountOfAssetRequest amount)
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            Wallet? wallet = await _db.Wallets.Where(w => w.UserId == userFromDb.Id).FirstOrDefaultAsync();
            if (wallet == null) return NotFound("Wallet Not Exist");

            Asset? assetFromDb = await _db.Assets.Where(a => a.WalletId == wallet.Id).FirstOrDefaultAsync();
            if (assetFromDb == null) return NotFound("Asset Not Exist");

            assetFromDb.Amount += amount.Amount;

            _db.Assets.Update(assetFromDb);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }

    public class UpdateAmountOfAssetRequest
    {
        public ulong Amount { get; set; }
    }
}