using System.ComponentModel.DataAnnotations;

namespace E_Governance_System.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
        

        // Role (Admin, Citizen, Officer, Supervisor)
        public int RoleId { get; set; }
        public Role Role { get; set; }

        // Department only for officers
        public int? DepartmentId { get; set; }
        public Department Department { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
