using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_Governance_System.Models.Entities
{
    public class GrievanceHistory
    {
        [Key]
        public int Id { get; set; }

        public int GrievanceId { get; set; }
        public Grievance Grievance { get; set; }

        // Submitted, Assigned, InReview, Resolved, Escalated, Closed
        [Required]
        public string Action { get; set; }

        public int PerformedById { get; set; }

        [ForeignKey(nameof(PerformedById))]
        public User PerformedBy { get; set; }

        public string Remarks { get; set; }

        public DateTime ActionAt { get; set; } = DateTime.UtcNow;
    }
}
