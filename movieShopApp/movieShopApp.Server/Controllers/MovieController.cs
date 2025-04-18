using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;
using movieShopApp.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace movieShopApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovieController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Movie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        // GET: /Movie/search?query=dark
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return await _context.Movies.Take(5).ToListAsync();

            var searchQuery = query.ToLower();
            return await _context.Movies
                .Where(m => m.Title.ToLower().Contains(searchQuery))
                .Take(5)
                .ToListAsync();
        }

        // GET: /Movie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }
    }
}