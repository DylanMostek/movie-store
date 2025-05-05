using Microsoft.AspNetCore.Mvc;

namespace movieShopApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HelloWorldController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return "hello world";
        }
    }
}