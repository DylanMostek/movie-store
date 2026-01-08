# Movie Store (Full-Stack .NET 8)

A full-stack movie storefront built with **.NET 8 / ASP.NET Core** and a **SQL database** (via **Entity Framework Core**).  
Includes a customer-facing experience (browse movies, cart, checkout) and admin functionality, plus **unit tests**.

## Tech Stack
- **Backend:** C# / .NET 8 / ASP.NET Core
- **Database:** SQL (EF Core)
- **Frontend:** Web UI (HTML/CSS/JavaScript as used in the project)
- **Testing:** Unit tests (EF Core InMemory where applicable)

## Core Features
- Browse movie catalog
- Add/remove items in cart
- Checkout / purchase flow
- User profile/account pages
- Admin functionality (create/update/manage movies)
- Database schema + scripts included (`*.sql`)
- Unit tests for key services/flows

## Project Structure (high-level)
- `movieShopApp/` — main application source
- `MovieShopSQL.sql` / `testInputs.sql` / `dropMovieTables.sql` — SQL scripts for setup/testing
- `README.md` — setup + usage

---

# Getting Started (Windows)

## Prerequisites
Install:
- **.NET 8 SDK**
- **SQL Server** (or SQL Server Express / LocalDB)
- (Optional) Visual Studio 2022 or VS Code

## 1) Clone the repo
```bash
git clone https://github.com/DylanMostek/movie-store.git
cd movie-store
