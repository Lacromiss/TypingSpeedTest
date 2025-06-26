using KlavyeTest.Models.LoginRegister;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KlavyeTest.Data;

namespace KlavyeTest.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;

        public UserController(UserManager<AppUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            var userWithScores = await _context.Users
                .Include(u => u.Scores)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (userWithScores == null)
            {
                return NotFound("Kullanıcı bilgileri bulunamadı.");
            }

            return View(userWithScores);
        }

    }
}
