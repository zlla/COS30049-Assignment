using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Helpers;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemCoinController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public SystemCoinController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("GetCoins")]
        public async Task<ActionResult> GetCoins()
        {
            return Ok(await _db.SystemCoins.ToListAsync());
        }

        [HttpGet("GetCoin/{id}")]
        public async Task<ActionResult> GetCoin(string id)
        {
            var coin = await _db.SystemCoins.FindAsync(id);

            if (coin == null)
            {
                return NotFound();
            }

            return Ok(coin);
        }
    }
}
