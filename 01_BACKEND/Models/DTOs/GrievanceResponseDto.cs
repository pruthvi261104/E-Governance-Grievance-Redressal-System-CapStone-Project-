namespace E_Governance_System.Models.DTOs
{
    public class GrievanceResponseDto
    {
        public int GrievanceId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public string Status { get; set; }

        public string CategoryName { get; set; }
        public string DepartmentName { get; set; }

        public string AssignedOfficerName { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsEscalated { get; set; }
    }
}
