using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;

namespace movieShopApp.Server.Models
{
    public class MovieService : IMovieService
    {
        private readonly ApplicationDbContext _context;

        public MovieService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Movie>> GetAllMoviesAsync()
        {
            return await _context.Movies.ToListAsync();
        }

        public async Task<IEnumerable<Movie>> SearchMoviesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return await _context.Movies.Take(5).ToListAsync();

            var searchQuery = query.ToLower();
            return await _context.Movies
                .Where(m => m.Title.ToLower().Contains(searchQuery))
                .Take(5)
                .ToListAsync();
        }

        public async Task<Movie?> GetMovieByIdAsync(int id)
        {
            return await _context.Movies.FindAsync(id);
        }
    }
} 