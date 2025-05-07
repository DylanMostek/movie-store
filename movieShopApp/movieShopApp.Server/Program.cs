using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;
using movieShopApp.Server.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

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

                // Add custom DateOnly model binder
                builder.Services.AddControllers(options =>
                {
                    options.ModelBinderProviders.Insert(0, new DateOnlyModelBinderProvider());
                });

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

                app.MapPost("/register", async (UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, [FromBody] RegisterModel model) =>
                {
                    if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                    {
                        return Results.BadRequest("Email and password are required.");
                    }

                    var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                    var result = await userManager.CreateAsync(user, model.Password);

                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "User");
                        await signInManager.SignInAsync(user, isPersistent: true);
                        return Results.Ok();
                    }

                    return Results.BadRequest(string.Join(", ", result.Errors.Select(e => e.Description)));
                });

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

                app.MapGet("/api/movies", async (ApplicationDbContext dbContext) =>
                {
                    var movies = await dbContext.Movies.ToListAsync();
                    return Results.Ok(movies);
                });

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

                app.MapPut("/api/movies/{id}", async (ApplicationDbContext dbContext, int id, [FromBody] Movie updatedMovie, ClaimsPrincipal user) =>
                {
                    if (!user.IsInRole("Admin"))
                    {
                        return Results.Forbid();
                    }

                    var existingMovie = await dbContext.Movies.FindAsync(id);
                    if (existingMovie == null)
                    {
                        return Results.NotFound($"Movie with ID {id} not found.");
                    }

                    // Validate teh required fields
                    var validationErrors = new List<string>();
                    if (string.IsNullOrEmpty(updatedMovie.Title)) validationErrors.Add("Title is required.");
                    if (string.IsNullOrEmpty(updatedMovie.Overview)) validationErrors.Add("Overview is required.");
                    if (updatedMovie.DateReleased == default) validationErrors.Add("DateReleased is required.");
                    if (updatedMovie.Rating < 1 || updatedMovie.Rating > 5) validationErrors.Add("Rating must be between 1 and 5.");
                    if (updatedMovie.Duration <= 0) validationErrors.Add("Duration must be greater than 0.");
                    if (updatedMovie.RentPrice < 0) validationErrors.Add("RentPrice must be non-negative.");
                    if (updatedMovie.BuyPrice < 0) validationErrors.Add("BuyPrice must be non-negative.");

                    if (validationErrors.Any())
                    {
                        return Results.BadRequest(new { Errors = validationErrors });
                    }

                    // Update only provided fields
                    existingMovie.Title = updatedMovie.Title;
                    existingMovie.Overview = updatedMovie.Overview;
                    existingMovie.ImageUrl = updatedMovie.ImageUrl ?? existingMovie.ImageUrl;
                    existingMovie.Genre = updatedMovie.Genre ?? existingMovie.Genre;
                    existingMovie.Rating = updatedMovie.Rating;
                    existingMovie.DateReleased = updatedMovie.DateReleased;
                    existingMovie.Duration = updatedMovie.Duration;
                    existingMovie.RentPrice = updatedMovie.RentPrice;
                    existingMovie.BuyPrice = updatedMovie.BuyPrice;
                    existingMovie.TrailerUrl = updatedMovie.TrailerUrl ?? existingMovie.TrailerUrl;
                    existingMovie.Director = updatedMovie.Director ?? existingMovie.Director;
                    existingMovie.Actor = updatedMovie.Actor ?? existingMovie.Actor;
                    existingMovie.Language = updatedMovie.Language ?? existingMovie.Language;

                    await dbContext.SaveChangesAsync();
                    return Results.Ok(existingMovie);
                }).RequireAuthorization();

                app.MapDelete("/api/movies/{id}", async (ApplicationDbContext dbContext, int id, ClaimsPrincipal user) =>
                {
                    if (!user.IsInRole("Admin"))
                    {
                        return Results.Forbid();
                    }

                    var movie = await dbContext.Movies.FindAsync(id);
                    if (movie == null)
                    {
                        return Results.NotFound($"Movie with ID {id} not found.");
                    }

                    dbContext.Movies.Remove(movie);
                    await dbContext.SaveChangesAsync();
                    return Results.NoContent();
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

    // Custom DateOnly model binder
    public class DateOnlyModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            var value = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(value))
            {
                return Task.CompletedTask;
            }

            if (DateOnly.TryParse(value, out var date))
            {
                bindingContext.Result = ModelBindingResult.Success(date);
            }
            else
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid date format. Use YYYY-MM-DD.");
            }

            return Task.CompletedTask;
        }
    }

    public class DateOnlyModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            if (context.Metadata.ModelType == typeof(DateOnly))
            {
                return new BinderTypeModelBinder(typeof(DateOnlyModelBinder));
            }

            return null;
        }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}