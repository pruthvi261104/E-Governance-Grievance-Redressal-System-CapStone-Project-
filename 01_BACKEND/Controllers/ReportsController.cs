using E_Governance_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_Governance_System.Controllers
{
    [Authorize(Roles = "Admin,SupervisoryOfficer")]
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("grievances-by-category")]
        public IActionResult GrievancesByCategory()
        {
            var result = _reportService.GetGrievancesByCategory();
            return Ok(result);
        }

        [HttpGet("grievances-by-department")]
        public IActionResult GrievancesByDepartment()
        {
            var result = _reportService.GetGrievancesByDepartment();
            return Ok(result);
        }

        [HttpGet("department-performance")]
        public IActionResult GetDepartmentPerformance()
        {
            return Ok(_reportService.GetDepartmentPerformance());
        }

        [HttpGet("status-summary")]
        public IActionResult StatusSummary()
        {
            return Ok(_reportService.GetStatusSummary());
        }   

    }
}
