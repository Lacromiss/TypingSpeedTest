using KlavyeTest.Models.Base;

namespace KlavyeTest.Models
{
    public class Language:BaseModel
    {
        public string Name { get; set; } // "Türkçe", "English", "Azərbaycan dili"
        public string Code { get; set; } // tr, en, etc.

        public ICollection<Word> Words { get; set; }
    }
}
