using KlavyeTest.Data;
using KlavyeTest.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace KlavyeTest.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext context;

        public HomeController(AppDbContext _context)
        {
            context = _context;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string? language = "eng", int durationInSeconds = 60)
        {
            language = language?.Trim();

            var languageId = context.Languages
     .Where(l => l.Code.ToLower() == language.ToLower())
     .Select(l => l.Id)
     .FirstOrDefault();

            var words = new List<string>();
            if (languageId != 0)
            {
                words = await context.Words
                    .Where(w => w.LanguageId == languageId)
                    .OrderBy(r => Guid.NewGuid())
                    .Take(50)
                    .Select(w => w.Text)
                    .ToListAsync();
            }

            var model = new TypingTestViewModel
            {
                Words = words,
                DurationInSeconds = durationInSeconds,
                SelectedLanguage = language,
                AvailableLanguages = await context.Languages
                    .Select(l => new LanguageOption { Code = l.Code, Name = l.Name })
                    .ToListAsync()
            };

            return View(model);
        }



        public IActionResult Privacy() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() =>
            View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    public class TypingTestViewModel
    {
        public List<string> Words { get; set; }
        public int DurationInSeconds { get; set; }
        public string SelectedLanguage { get; set; }
        public List<LanguageOption> AvailableLanguages { get; set; }
    }

    public class LanguageOption
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
