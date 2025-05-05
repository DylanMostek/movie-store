using System.Collections.Generic;
using System.Threading.Tasks;
using movieShopApp.Server.Models;

namespace movieShopApp.Server.Models
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> GetAllMoviesAsync();
        Task<Movie?> GetMovieByIdAsync(int id);
        Task<IEnumerable<Movie>> SearchMoviesAsync(string query);
    }
} 