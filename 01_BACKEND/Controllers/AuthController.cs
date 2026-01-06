using E_Governance_System.Models.DTOs;
using E_Governance_System.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace E_Governance_System.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            try
            {
                _authService.Register(dto);
                return Ok(new { success = true, message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                // Return 400 Bad Request with error message
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            try
            {
                var token = _authService.Login(dto);
                return Ok(new { success = true, token, message = "Login successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
