using Microsoft.AspNetCore.Mvc;

namespace KlavyeTest.Controllers
{
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
