using KlavyeTest.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace KlavyeTest.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var words = new List<string>
        {
            "elma", "araba", "masa", "kalem", "defter", "bilgisayar", "yazılım", "klavye"
        };

            int durationInSeconds = 45; // Məsələn, 45 saniyəlik test

            var model = new TypingTestViewModel
            {
                Words = words,
                DurationInSeconds = durationInSeconds
            };

            return View(model);
        }
        public class TypingTestViewModel
        {
            public List<string> Words { get; set; }
            public int DurationInSeconds { get; set; }
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
