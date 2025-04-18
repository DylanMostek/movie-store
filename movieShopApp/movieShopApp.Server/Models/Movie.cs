namespace movieShopApp.Server.Models
{
    public class Movie
    {
        public int Id { get; set; } // Primary key, automatlically made by SQL Server
        public string Title { get; set; } = string.Empty;
        public string Overview { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateOnly DateReleased { get; set; }
        public int Duration { get; set; }
        public double RentPrice { get; set; }
        public double BuyPrice { get; set; }
        public string TrailerUrl { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Actor { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
    }
}