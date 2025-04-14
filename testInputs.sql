INSERT INTO Users (Username, PassHash, Email, FirstName, LastName) 
VALUES ('john_doe', 'hashed_password1', 'john@example.com', 'John', 'Doe');

INSERT INTO Users (Username, PassHash, FirstName, LastName) 
VALUES ('jane_smith', 'hashed_password2', 'Jane', 'Smith'); 

INSERT INTO Users (IsAdmin, Username, PassHash, Email, FirstName) 
VALUES (1, 'admin_user', 'adminpasshash', 'admin@domain.com', 'Admin');

INSERT INTO Actors (Name) VALUES ('Tom Hanks');

INSERT INTO Actors (Name) VALUES ('Meryl Streep');

INSERT INTO Actors (Name) VALUES ('Leonardo DiCaprio');

INSERT INTO Genres (Name) VALUES ('Action');

INSERT INTO Genres (Name) VALUES ('Comedy');

INSERT INTO Genres (Name) VALUES ('Drama');

INSERT INTO Movies (Title, Description, ReleaseDate, Director, Price, Ratings, ImageURL, GenreID)
VALUES ('Inception', 'A mind-bending thriller', '2010-07-16', 'Christopher Nolan', 12.99, 8.8, 'inception.jpg', 1);

INSERT INTO Movies (Title, Price, GenreID)
VALUES ('The Big Sick', 8.99, 2);  

INSERT INTO Movies (Title, Description, ReleaseDate, Director, Price, Ratings, GenreID)
VALUES ('The Godfather', 'Mafia crime story', '1972-03-24', 'Francis Ford Coppola', 10.99, 9.2, 3);

INSERT INTO Orders (UserID, ShipAddress, TotalAmount)
VALUES (1, '123 Main St, NY', 25.98);

INSERT INTO Orders (UserID, ShipAddress, TotalAmount, PromoCodeUsed)
VALUES (2, '456 Elm St, CA', 15.50, 'SPRING10');

INSERT INTO Orders (UserID, ShipAddress, TotalAmount)
VALUES (1, '789 Oak St, IL', 30.00);

INSERT INTO PromoCodes (Code, DiscountPercentage, ExpDate, IsActive)
VALUES ('SPRING10', 10.00, '2025-06-01', 1);

INSERT INTO PromoCodes (Code, DiscountPercentage, ExpDate)
VALUES ('WELCOME5', 5.00, '2025-12-31');

INSERT INTO PromoCodes (Code, DiscountPercentage)
VALUES ('FREEMOVIE', 100.00);

INSERT INTO OrderItems (OrderID, MovieID, PriceAtPurch)
VALUES (1, 1, 12.99);

INSERT INTO OrderItems (OrderID, MovieID, Quant, PriceAtPurch)
VALUES (1, 2, 2, 8.99);

INSERT INTO OrderItems (OrderID, MovieID, Quant, PriceAtPurch)
VALUES (2, 3, 1, 10.99);

INSERT INTO ShoppingCarts (UserID) VALUES (1);

INSERT INTO ShoppingCarts (UserID) VALUES (2);

INSERT INTO ShoppingCarts (UserID) VALUES (3);

INSERT INTO ShoppingCartItems (CartID, MovieID, Quant)
VALUES (1, 1, 1);

INSERT INTO ShoppingCartItems (CartID, MovieID)
VALUES (1, 2);  

INSERT INTO ShoppingCartItems (CartID, MovieID, Quant)
VALUES (2, 3, 2);
