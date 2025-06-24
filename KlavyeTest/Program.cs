using KlavyeTest.Data;
using KlavyeTest.Models.LoginRegister;
using KlavyeTest.Services; // KlavyeTest.Services namespace'ini ekledik
using KlavyeTest.Services.Concretes;
using KlavyeTest.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🔸 Add services to the container
builder.Services.AddControllersWithViews();

// 🔸 DbContext burada olmalıdır (builder.Build()'dan əvvəl!)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("cString")));
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// 🔸 Servis katmanını DI konteynerine ekle
// ITypingTestService arayüzünü TypingTestService sınıfı ile ilişkilendiriyoruz.
builder.Services.AddScoped<ITypingTestService, TypingTestService>();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
});
var app = builder.Build();

// 🔸 Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();