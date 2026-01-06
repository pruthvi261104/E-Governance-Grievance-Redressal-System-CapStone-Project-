using System.ComponentModel.DataAnnotations;

namespace E_Governance_System.Models.Entities
{
    public class Grievance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        // Citizen who raised grievance
        public int CitizenId { get; set; }
        public User Citizen { get; set; }

        // Category & Department (auto-mapped)
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int DepartmentId { get; set; }
        public Department Department { get; set; }

        // Assigned officer
        public int? AssignedToId { get; set; }
        public User AssignedTo { get; set; }

        // Workflow status
        public string Status { get; set; }
        // Submitted → Assigned → InReview → Resolved → Closed → Escalated

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }

        public bool IsEscalated { get; set; } = false;



    }
}
