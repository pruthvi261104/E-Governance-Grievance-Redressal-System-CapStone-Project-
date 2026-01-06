namespace E_Governance_System.Models.DTOs
{
    public class AssignRoleDto
    {
        public int UserId { get; set; }
        public string RoleName { get; set; } // DepartmentOfficer, SupervisoryOfficer
        public int? DepartmentId { get; set; }
    }
}
