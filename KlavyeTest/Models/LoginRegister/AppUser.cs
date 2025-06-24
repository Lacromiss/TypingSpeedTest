using KlavyeTest.Models.Base;
using static System.Formats.Asn1.AsnWriter;
using System.ComponentModel.DataAnnotations;
using KlavyeTest.Models.User;
using Microsoft.AspNetCore.Identity;

namespace KlavyeTest.Models.LoginRegister
{
    public class AppUser : IdentityUser
    {
        public int? Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? KeyboardLayout { get; set; }
        public string? KeyboardModel { get; set; }


        public ICollection<Score>? Scores { get; set; }
    }
}
