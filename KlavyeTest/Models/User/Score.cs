using KlavyeTest.Models.Base;
using KlavyeTest.Models.LoginRegister;

namespace KlavyeTest.Models.User
{
    public class Score:BaseModel
    {
        public string? UserId { get; set; }
        public AppUser? User { get; set; }
        //cod

        public int WordCount { get; set; }
        public int IncorrectWordCount { get; set; }
        public int KeystrokesCorrect { get; set; }
        public int KeystrokesIncorrect { get; set; }

        public int DurationSeconds { get; set; }
        public bool IsCompetition { get; set; }

        public DateTime TestDate { get; set; } = DateTime.UtcNow;
    }
}
