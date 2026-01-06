using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;

namespace E_Governance_System.Services.Interfaces
{
    public interface IAdminService
    {
        void AssignRole(AssignRoleDto dto);
        void AddDepartment(CreateDepartmentDto dto);
        void AddCategory(CreateCategoryDto dto);
        void AddRole(CreateRoleDto dto);
        

        List<User> GetAllUsers();
        List<Department> GetAllDepartments();
        List<Category> GetAllCategories();
        List<Role> GetAllRoles();
    }
}
