using KlavyeTest.Data;
using KlavyeTest.Models;
using KlavyeTest.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace KlavyeTest.Controllers
{
    public class HomeController : Controller
    {
        private readonly ITypingTestService _typingTestService; // Servisi enjekte edeceğiz

        public HomeController(ITypingTestService typingTestService) // Constructor'ı güncelleyin
        {
            _typingTestService = typingTestService;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string? language = "eng", int durationInSeconds = 60)
        {
            language = language?.Trim();

            // Veritabanı işlemleri artık servis aracılığıyla yapılıyor
            var languageId = await _typingTestService.GetLanguageIdByCodeAsync(language);

            var words = await _typingTestService.GetRandomWordsByLanguageIdAsync(languageId);

            var availableLanguages = await _typingTestService.GetAvailableLanguagesAsync();

            var model = new TypingTestViewModel
            {
                Words = words,
                DurationInSeconds = durationInSeconds,
                SelectedLanguage = language,
                AvailableLanguages = availableLanguages
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
