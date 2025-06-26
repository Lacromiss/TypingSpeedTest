using KlavyeTest.Data;
using KlavyeTest.Models.LoginRegister;
using KlavyeTest.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace KlavyeTest.Controllers
{
    public class TestController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TestController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> SaveScore([FromBody] Score scoreInput)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            var score = new Score
            {
                WordCount = scoreInput.WordCount,
                IncorrectWordCount = scoreInput.IncorrectWordCount,
                KeystrokesCorrect = scoreInput.KeystrokesCorrect,
                KeystrokesIncorrect = scoreInput.KeystrokesIncorrect,
                DurationSeconds = scoreInput.DurationSeconds,
                IsCompetition = scoreInput.IsCompetition,
                TestDate = DateTime.UtcNow,
                UserId = Convert.ToString(user.Id)
            };

            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    
    }
}
