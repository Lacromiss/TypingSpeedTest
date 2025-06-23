using KlavyeTest.Models.Base;

namespace KlavyeTest.Models
{
    public class Word:BaseModel
    {
        public string Text { get; set; }

        public int? LanguageId { get; set; }
        public Language? Language { get; set; }
    }
}
