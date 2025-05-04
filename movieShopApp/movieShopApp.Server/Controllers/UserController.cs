namespace movieShopApp.Server.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using movieShopApp.Server.Data;
using movieShopApp.Server.Models;
[ApiController]
[Route("[controller]")]

public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<User>> GetCurrentUser()
    {
       
        var userEmail = User.Identity?.Name;

        var user = await _context.UsersDB
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == userEmail);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName
        });


    }
}
