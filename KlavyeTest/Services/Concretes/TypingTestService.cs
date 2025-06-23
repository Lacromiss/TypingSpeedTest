using KlavyeTest.Controllers;
using KlavyeTest.Data;
using KlavyeTest.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KlavyeTest.Services.Concretes
{
    public class TypingTestService : ITypingTestService
    {
        private readonly AppDbContext _context;

        public TypingTestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetLanguageIdByCodeAsync(string languageCode)
        {
            return await _context.Languages
                .Where(l => l.Code.ToLower() == languageCode.ToLower())
                .Select(l => l.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<List<string>> GetRandomWordsByLanguageIdAsync(int languageId)
        {
            if (languageId == 0)
            {
                return new List<string>();
            }

            var totalWordsCount = await _context.Words
                .Where(w => w.LanguageId == languageId)
                .CountAsync();

            var wordsToTake = Math.Max(1, (int)Math.Round(totalWordsCount * 0.20));

            return await _context.Words
                .Where(w => w.LanguageId == languageId)
                .OrderBy(r => Guid.NewGuid())
                .Take(wordsToTake)
                .Select(w => w.Text)
                .ToListAsync();
        }

        public async Task<List<LanguageOption>> GetAvailableLanguagesAsync()
        {
            return await _context.Languages
                .Select(l => new LanguageOption { Code = l.Code, Name = l.Name })
                .ToListAsync();
        }
    }
}
