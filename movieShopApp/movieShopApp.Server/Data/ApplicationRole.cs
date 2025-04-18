using Microsoft.AspNetCore.Identity;

namespace movieShopApp.Server.Data
{
    public class ApplicationRole : IdentityRole
    {

        public ApplicationRole(string roleName) : base(roleName)
        {
           
        }
        public ApplicationRole() : base()
        {
        }

    }
}
