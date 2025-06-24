using KlavyeTest.Models;
using KlavyeTest.Models.LoginRegister;
using KlavyeTest.Models.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KlavyeTest.Data 
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<Score> Scores { get; set; }
    }
}
