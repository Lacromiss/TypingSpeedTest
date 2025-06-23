using KlavyeTest.Controllers;

namespace KlavyeTest.Services.Interfaces
{
    public interface ITypingTestService
    {
        Task<int> GetLanguageIdByCodeAsync(string languageCode);
        Task<List<string>> GetRandomWordsByLanguageIdAsync(int languageId);
        Task<List<LanguageOption>> GetAvailableLanguagesAsync();
    }
}
