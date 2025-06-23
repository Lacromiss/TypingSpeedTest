using KlavyeTest.Models;
using Microsoft.EntityFrameworkCore;

namespace KlavyeTest.Data 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<TestResult> TestResults { get; set; }

    }
}
