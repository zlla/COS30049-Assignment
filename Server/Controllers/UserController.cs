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
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AuthLibrary _authLibrary;

        public UserController(ApplicationDbContext db, AuthLibrary authLibrary)
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

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            UserModule usermodule = new()
            {
                Username = userFromDb.Username,
                Email = userFromDb.Email,
                Name = userFromDb.Username,
            };

            return Ok(usermodule);
        }

        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser([FromBody] UpdateModule request)
        {
            User? userFromDb = await GetUserFromAccessToken();
            if (userFromDb == null)
            {
                return NotFound("User not found");
            }

            if (request.Username != null) userFromDb.Username = request.Username;
            if (request.Name != null) userFromDb.Name = request.Name;
            if (request.Password != null) userFromDb.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            _db.Users.Update(userFromDb);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }

    public class UserModule
    {
        public required string Username { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
    }

    public class UpdateModule
    {
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}