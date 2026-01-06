using System.ComponentModel.DataAnnotations;

namespace E_Governance_System.Models.Entities
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } // Citizen/User ID receiving the notification
        public int GrievanceId { get; set; }
        public string Message { get; set; }
        public string Type { get; set; } // "Submission" or "StatusChange"
        public bool IsRead { get; set; } = false;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}
