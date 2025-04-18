using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Models;

namespace movieShopApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Person> Persons { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Movie and Person relationships
            builder.Entity<Person>()
                .HasMany(p => p.Filmography)
                .WithMany()
                .UsingEntity(j => j.ToTable("PersonMovies"));
        }
    }
}