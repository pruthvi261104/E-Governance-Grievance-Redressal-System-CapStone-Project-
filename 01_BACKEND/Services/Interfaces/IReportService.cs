using E_Governance_System.Models.DTOs;

namespace E_Governance_System.Services.Interfaces
{
    public interface IReportService
    {
        List<DepartmentPerformanceDto> GetDepartmentPerformance();
        List<StatusSummaryDto> GetStatusSummary();
        List<object> GetGrievancesByCategory();

        List<object> GetGrievancesByDepartment();

    }
}
