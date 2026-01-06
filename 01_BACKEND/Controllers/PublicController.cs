using E_Governance_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_Governance_System.Controllers
{
    [ApiController]
    [Route("api/public")]
    [Authorize]
    public class PublicController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public PublicController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _adminService.GetAllCategories();

            var result = categories.Select(c => new {
                id = c.Id,
                name = c.Name,
                departmentId = c.DepartmentId,
                departmentName = c.Department?.Name
            });

            return Ok(result);
        }

        //Fetches all Department Officers for the Supervisor
        [HttpGet("officers")]
        public IActionResult GetOfficers()
        {
            // Assuming your AdminService can fetch users by role
            var officers = _adminService.GetAllUsers()
                .Where(u => u.Role?.Name == "DepartmentOfficer");

            var result = officers.Select(u => new {
                id = u.Id,                       // Matches officer.id in frontend
                fullName = u.FullName,           // Matches officer.fullName
                email = u.Email,                 // Matches officer.email
                department = new
                {
                    name = u.Department?.Name ?? "General" // Matches officer.department.name
                }
            });

            return Ok(result);
        }
    }
}