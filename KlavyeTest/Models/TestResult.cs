using KlavyeTest.Models.Base;

namespace KlavyeTest.Models
{
    public class TestResult : BaseModel 
    {
        public DateTime CreatedAt { get; set; }

        public int? LanguageId { get; set; }
        public Language? Language { get; set; }

        public int DurationInSeconds { get; set; } // test zamanı (məs: 30 saniyə)
        public int CorrectWords { get; set; }
        public int IncorrectWords { get; set; }
        public int TotalTypedWords => CorrectWords + IncorrectWords;

    }
}
