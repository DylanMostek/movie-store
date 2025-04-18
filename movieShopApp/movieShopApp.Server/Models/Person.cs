using System.Collections.Generic;

namespace movieShopApp.Server.Models
{
    public class Person
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public List<Movie> Filmography { get; set; } = new List<Movie>();
        public string ImageUrl { get; set; } = string.Empty;
        public string Biography { get; set; } = string.Empty;
    }
}