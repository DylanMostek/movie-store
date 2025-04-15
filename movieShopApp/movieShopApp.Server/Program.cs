using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;
using System.Security.Claims;

namespace movieShopApp.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                var connectionString = builder.Configuration.GetConnectionString("DbContextConnection") ?? throw new InvalidOperationException("Connection string not found.");

                builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

                builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
                    .AddRoles<IdentityRole>()
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders();

                builder.Services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequiredLength = 6;
                });

                builder.Services.AddAuthorization();

                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();

                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowViteDevServer", builder =>
                    {
                        builder.WithOrigins("https://localhost:52357")
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowCredentials();
                    });
                });

                builder.Services.AddLogging(logging =>
                {
                    logging.AddConsole();
                    logging.SetMinimumLevel(LogLevel.Debug);
                });

                var app = builder.Build();

                using (var scope = app.Services.CreateScope())
                {
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                    try
                    {
                        if (!await roleManager.RoleExistsAsync("Admin"))
                        {
                            var roleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
                            if (!roleResult.Succeeded)
                            {
                                throw new Exception("Failed to create Admin role: " + string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                            }
                        }

                        var adminEmail = "admin@example.com";
                        var adminUser = await userManager.FindByEmailAsync(adminEmail);
                        if (adminUser == null)
                        {
                            adminUser = new ApplicationUser { UserName = adminEmail, Email = adminEmail };
                            var userResult = await userManager.CreateAsync(adminUser, "Admin123!@");
                            if (!userResult.Succeeded)
                            {
                                throw new Exception("Failed to create admin user: " + string.Join(", ", userResult.Errors.Select(e => e.Description)));
                            }
                            var roleAssignResult = await userManager.AddToRoleAsync(adminUser, "Admin");
                            if (!roleAssignResult.Succeeded)
                            {
                                throw new Exception("Failed to assign Admin role: " + string.Join(", ", roleAssignResult.Errors.Select(e => e.Description)));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error during seeding: {ex.Message}");
                        throw;
                    }
                }

                var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                if (!Directory.Exists(wwwrootPath))
                {
                    throw new DirectoryNotFoundException($"The wwwroot directory was not found at {wwwrootPath}");
                }

                app.UseDefaultFiles();
                app.UseStaticFiles();

                app.UseHttpsRedirection();
                app.UseCors("AllowViteDevServer");
                app.UseAuthentication(); 
                app.UseAuthorization();
                app.MapControllers();

                app.MapIdentityApi<ApplicationUser>();

                app.MapPost("/logout", async (SignInManager<ApplicationUser> signInManager) =>
                {
                    await signInManager.SignOutAsync();
                    return Results.Ok();
                }).RequireAuthorization();

                app.MapGet("/pingauth", (ClaimsPrincipal user) =>
                {
                    var email = user.FindFirstValue(ClaimTypes.Email);
                    var roles = user.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
                    return Results.Json(new { Email = email, Roles = roles });
                }).RequireAuthorization();

                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.MapFallbackToFile("/index.html");

                await app.RunAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Application failed to start: {ex.Message}");
                throw;
            }
        }
    }
}