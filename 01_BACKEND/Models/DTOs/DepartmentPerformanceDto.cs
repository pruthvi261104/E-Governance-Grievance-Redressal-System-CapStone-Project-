namespace E_Governance_System.Models.DTOs
{
    public class DepartmentPerformanceDto
    {
        public string DepartmentName { get; set; }

        public int TotalGrievances { get; set; }

        public int ResolvedGrievances { get; set; }

        public int PendingGrievances { get; set; }

        public double AverageResolutionHours { get; set; }
    }
}
