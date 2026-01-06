using E_Governance_System.Data;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;
using E_Governance_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }
        public void AssignRole(AssignRoleDto dto)
        {
            var user = _context.Users.Find(dto.UserId)
                ?? throw new Exception("User not found");

            var role = _context.Roles.FirstOrDefault(r => r.Name == dto.RoleName)
                ?? throw new Exception("Invalid role");

            user.RoleId = role.Id;
            user.DepartmentId = dto.DepartmentId;

            _context.SaveChanges();
        }
        public void AddDepartment(CreateDepartmentDto dto)
        {
            if (_context.Departments.Any(d => d.Name == dto.Name))
                throw new Exception("Department already exists");

            var department = new Department
            {
                Name = dto.Name
            };

            _context.Departments.Add(department);
            _context.SaveChanges();
        }
        public void AddCategory(CreateCategoryDto dto)
        {
            if (!_context.Departments.Any(d => d.Id == dto.DepartmentId))
                throw new Exception("Invalid department");

            var category = new Category
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId
            };

            _context.Categories.Add(category);
            _context.SaveChanges();
        }
        public void AddRole(CreateRoleDto dto)
        {
            if (_context.Roles.Any(r => r.Name == dto.Name))
                throw new Exception("Role already exists");

            var role = new Role
            {
                Name = dto.Name
            };

            _context.Roles.Add(role);
            _context.SaveChanges();
        }


        public List<User> GetAllUsers()
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .ToList();
        }
        
        // Add these implementations:
        public List<Department> GetAllDepartments()
        {
            return _context.Departments.ToList();
        }

        public List<Category> GetAllCategories()
        {
            return _context.Categories
                .Include(c => c.Department) // Important for showing Dept Name in table
                .ToList();
        }

        public List<Role> GetAllRoles()
        {
            return _context.Roles.ToList();
        }
    }
}
