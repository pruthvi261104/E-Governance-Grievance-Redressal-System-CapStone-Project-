using E_Governance_System.Data;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // Department Performance Report
        // ===============================
        public List<DepartmentPerformanceDto> GetDepartmentPerformance()
        {
            return _context.Grievances
        .Include(g => g.Department)
        .Where(g => g.ResolvedAt != null)   // DB-side filtering
        .AsEnumerable()                     // 🔥 SWITCH TO MEMORY
        .GroupBy(g => g.Department.Name)
        .Select(g => new DepartmentPerformanceDto
        {
            DepartmentName = g.Key,
            TotalGrievances = g.Count(),
            ResolvedGrievances = g.Count(),
            PendingGrievances = 0, // optional here
            AverageResolutionHours =
                g.Average(x => (x.ResolvedAt.Value - x.CreatedAt).TotalHours)
        })
        .ToList();
        }

        // ===============================
        // Grievance Status Summary
        // ===============================
        public List<StatusSummaryDto> GetStatusSummary()
        {
            return _context.Grievances
                .GroupBy(g => g.Status)
                .Select(g => new StatusSummaryDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToList();
        }

        public List<object> GetGrievancesByCategory()
        {
            return _context.Grievances
                .Include(g => g.Category)
                .GroupBy(g => g.Category.Name)
                .Select(g => new
                {
                    CategoryName = g.Key,
                    Count = g.Count()
                })
                .ToList<object>();
        }

        // ===============================
        // GRIEVANCES BY DEPARTMENT
        // ===============================
        public List<object> GetGrievancesByDepartment()
        {
            return _context.Grievances
                .Include(g => g.Department)
                .GroupBy(g => g.Department.Name)
                .Select(g => new
                {
                    DepartmentName = g.Key,
                    Count = g.Count()
                })
                .ToList<object>();
        }
    }
}
