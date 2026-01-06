using E_Governance_System.Models.DTOs;
using E_Governance_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        //ASSIGN ROLE
        [HttpPut("assign-role")]
        public IActionResult AssignRole(AssignRoleDto dto)
        {
            _adminService.AssignRole(dto);
            return Ok(new { message = "Role assigned successfully" });
        }

        [HttpPost("department")]
        public IActionResult AddDepartment(CreateDepartmentDto dto)
        {
            _adminService.AddDepartment(dto);
            return Ok(new { message = "Department added successfully" });
        }

        [HttpPost("category")]
        public IActionResult AddCategory(CreateCategoryDto dto)
        {
            _adminService.AddCategory(dto);
            return Ok(new { message = "Category added successfully" });
        }

        [HttpPost("role")]
        public IActionResult AddRole(CreateRoleDto dto)
        {
            _adminService.AddRole(dto);
            return Ok(new { message = "Role added successfully" });
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return Ok(_adminService.GetAllUsers());
        }

        [HttpGet("departments")]
        public IActionResult GetAllDepartments()
        {
            // Fetch departments from DB
            var departments = _adminService.GetAllDepartments();
            return Ok(departments); 
        }
        [HttpGet("categories")]
        [Authorize]
        public IActionResult GetAllCategories()
        {
            var categories = _adminService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("roles")]
        public IActionResult GetAllRoles()
        {
            var roles = _adminService.GetAllRoles();
            return Ok(roles);
        }
    }
}
