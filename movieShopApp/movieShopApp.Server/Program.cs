using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;
using movieShopApp.Server.Models;
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
                    .AddRoles<ApplicationRole>()
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

                builder.Services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    options.Cookie.SameSite = SameSiteMode.Lax;
                    options.Cookie.Name = ".AspNetCore.Identity.Application";
                    options.ExpireTimeSpan = TimeSpan.FromDays(7);
                    options.SlidingExpiration = true;
                    options.Cookie.Path = "/";
                });

                builder.Services.AddAuthorization();
                builder.Services.AddControllers();
                builder.Services.AddSwaggerGen();

                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowFrontend", builder =>
                    {
                        builder.WithOrigins("https://localhost:52357", "https://localhost:7131", "https://localhost:5173")
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
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    try
                    {
                        if (!await roleManager.RoleExistsAsync("Admin"))
                        {
                            var roleResult = await roleManager.CreateAsync(new ApplicationRole("Admin"));
                            if (!roleResult.Succeeded)
                            {
                                throw new Exception("Failed to create Admin role: " + string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                            }
                        }

                        if (!await roleManager.RoleExistsAsync("User"))
                        {
                            var roleResult = await roleManager.CreateAsync(new ApplicationRole("User"));
                            if (!roleResult.Succeeded)
                            {
                                throw new Exception("Failed to create User role: " + string.Join(", ", roleResult.Errors.Select(e => e.Description)));
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
                                throw new Exception("Failed to assign Admin role");
                            }
                        }

                        var users = await userManager.Users.ToListAsync();
                        foreach (var user in users)
                        {
                            if (user.Email != adminEmail)
                            {
                                if (!await userManager.IsInRoleAsync(user, "User"))
                                {
                                    var roleAssignResult = await userManager.AddToRoleAsync(user, "User");
                                    if (!roleAssignResult.Succeeded)
                                    {
                                        throw new Exception($"Failed to assign User role to {user.Email}: " + string.Join(", ", roleAssignResult.Errors.Select(e => e.Description)));
                                    }
                                }
                            }
                        }

                        if (!await dbContext.Movies.AnyAsync())
                        {
                            var movies = new List<Movie>
                            {
                                new Movie
                                {
                                    Title = "The Dark Knight",
                                    Overview = "Batman raises the stakes in his war on crime.",
                                    ImageUrl = "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                                    Genre = "Action, Thriller",
                                    Rating = 5,
                                    DateReleased = new DateOnly(2008, 7, 18),
                                    Duration = 152,
                                    RentPrice = 3.99,
                                    BuyPrice = 14.99,
                                    TrailerUrl = "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                                    Director = "Christopher Nolan",
                                    Actor = "Christian Bale, Heath Ledger",
                                    Language = "English"
                                },
                                new Movie
                                {
                                    Title = "Inception",
                                    Overview = "A thief who steals corporate secrets through dream-sharing technology.",
                                    ImageUrl = "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                                    Genre = "Sci-Fi, Thriller",
                                    Rating = 5,
                                    DateReleased = new DateOnly(2010, 7, 16),
                                    Duration = 148,
                                    RentPrice = 3.99,
                                    BuyPrice = 14.99,
                                    TrailerUrl = "https://www.youtube.com/watch?v=YoHD9XEInc0",
                                    Director = "Christopher Nolan",
                                    Actor = "Leonardo DiCaprio, Joseph Gordon-Levitt",
                                    Language = "English"
                                },
                                new Movie
                                {
                                    Title = "Interstellar",
                                    Overview = "A team of explorers travel through a wormhole in space.",
                                    ImageUrl = "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                                    Genre = "Sci-Fi, Drama",
                                    Rating = 5,
                                    DateReleased = new DateOnly(2014, 11, 7),
                                    Duration = 169,
                                    RentPrice = 3.99,
                                    BuyPrice = 14.99,
                                    TrailerUrl = "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                                    Director = "Christopher Nolan",
                                    Actor = "Matthew McConaughey, Anne Hathaway",
                                    Language = "English"
                                }
                            };

                            dbContext.Movies.AddRange(movies);
                            await dbContext.SaveChangesAsync();
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
                app.UseCors("AllowFrontend");
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

                // add a new movie, only for Admin
                app.MapPost("/api/movies", async (ApplicationDbContext dbContext, Movie movie, ClaimsPrincipal user) =>
                {
                    if (!user.IsInRole("Admin"))
                    {
                        return Results.Forbid();
                    }

                    if (string.IsNullOrEmpty(movie.Title) || string.IsNullOrEmpty(movie.Overview))
                    {
                        return Results.BadRequest("Title and Overview are required.");
                    }

                    if (movie.DateReleased == default)
                    {
                        return Results.BadRequest("DateReleased is required.");
                    }

                    if (movie.Rating < 1 || movie.Rating > 5)
                    {
                        return Results.BadRequest("Rating must be between 1 and 5.");
                    }

                    if (movie.Duration <= 0)
                    {
                        return Results.BadRequest("Duration must be greater than 0.");
                    }

                    if (movie.RentPrice < 0 || movie.BuyPrice < 0)
                    {
                        return Results.BadRequest("RentPrice and BuyPrice must be non-negative.");
                    }

                    movie.Genre = string.IsNullOrEmpty(movie.Genre) ? "" : string.Join(", ", movie.Genre.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(g => g.Trim()));
                    movie.Director = string.IsNullOrEmpty(movie.Director) ? "" : string.Join(", ", movie.Director.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(d => d.Trim()));
                    movie.Actor = string.IsNullOrEmpty(movie.Actor) ? "" : string.Join(", ", movie.Actor.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(a => a.Trim()));
                    movie.Language = string.IsNullOrEmpty(movie.Language) ? "" : string.Join(", ", movie.Language.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(l => l.Trim()));

                    movie.ImageUrl ??= "";
                    movie.TrailerUrl ??= "";

                    dbContext.Movies.Add(movie);
                    await dbContext.SaveChangesAsync();

                    return Results.Created($"/api/movies/{movie.Id}", movie);
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