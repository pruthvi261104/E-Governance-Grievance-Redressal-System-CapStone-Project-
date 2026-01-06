namespace E_Governance_System.Models.DTOs
{
    public class ReportDto
    {
        public string DepartmentName { get; set; }

        public int TotalGrievances { get; set; }

        public int ResolvedGrievances { get; set; }

        public int PendingGrievances { get; set; }

        public int EscalatedGrievances { get; set; }

        public double AverageResolutionTimeInHours { get; set; }
    }
}
