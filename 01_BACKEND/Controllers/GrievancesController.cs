using E_Governance_System.Data;
using E_Governance_System.Models;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;
using E_Governance_System.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace E_Governance_System.Controllers
{
    [ApiController]
    [Route("api/grievances")]
    public class GrievancesController : ControllerBase
    {
        private readonly IGrievanceService _grievanceService;
        private readonly ApplicationDbContext _context;

        public GrievancesController(IGrievanceService grievanceService, ApplicationDbContext context)
        {
            _grievanceService = grievanceService;
            _context = context;
        }

        [Authorize(Roles = "Citizen")]
        [HttpPost]
        public async Task<IActionResult> CreateGrievance(GrievanceCreateDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            //Casting to dynamic solves the 'object does not contain GrievanceId' error
            object result = _grievanceService.CreateGrievance(dto, userId);

            // 2. Use Reflection to safely get the 'Id' property value
            var idProperty = result.GetType().GetProperty("Id");
            int grievanceId = (int)(idProperty?.GetValue(result, null) ?? 0);

            await GrievanceNotificationQueue.Channel.Writer.WriteAsync(new GrievanceNotificationEvent
            {
                UserId = userId.ToString(),
                GrievanceId = grievanceId,
                Type = "Submission",
                Message = $"Grievance #{grievanceId} successfully submitted and is under review."
            });

            return Ok(result);
        }

        [Authorize(Roles = "Citizen")]
        [HttpGet("my")]
        public IActionResult MyGrievances()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(_grievanceService.GetByCitizen(userId));
        }

        [Authorize(Roles = "Citizen")]
        [HttpPut("{id}/escalate")]
        public async Task<IActionResult> Escalate(int id)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.EscalateGrievance(id, userId);

            await TriggerStatusNotification(id, "StatusChange", "Your grievance has been escalated to a supervisor.");

            return Ok("Grievance escalated");
        }

        [Authorize(Roles = "Citizen")]
        [HttpPut("{id}/reopen")]
        public async Task<IActionResult> Reopen(int id, ReopenGrievanceDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.ReopenGrievance(id, userId, dto.Reason);

            await TriggerStatusNotification(id, "StatusChange", "Your grievance has been reopened for further investigation.");

            return Ok("Grievance reopened");
        }

        [Authorize(Roles = "DepartmentOfficer")]
        [HttpGet("department")]
        public IActionResult DepartmentGrievances()
        {
            var deptClaim = User.FindFirstValue("DepartmentId");
            if (string.IsNullOrEmpty(deptClaim))
                return BadRequest("DepartmentId claim is missing.");

            int deptId = int.Parse(deptClaim);
            return Ok(_grievanceService.GetByDepartment(deptId));
        }

        [Authorize(Roles = "DepartmentOfficer")]
        [HttpPut("{id}/in-review")]
        public async Task<IActionResult> MarkInReview(int id, InReviewDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.MarkInReview(id, userId, dto.Remarks);

            await TriggerStatusNotification(id, "StatusChange", "An officer is now actively reviewing your grievance.");

            return Ok("Grievance marked as InReview");
        }

        [Authorize(Roles = "DepartmentOfficer")]
        [HttpPut("{id}/resolve")]
        public async Task<IActionResult> Resolve(int id, [FromBody] GrievanceResolveDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.ResolveGrievance(id, dto.Remarks, userId);

            await TriggerStatusNotification(id, "StatusChange", "Your grievance has been marked as Resolved. Please check the resolution details.");

            return Ok("Grievance resolved");
        }

        [Authorize(Roles = "SupervisoryOfficer")]
        [HttpGet("all")]
        public IActionResult GetAllGrievances()
        {
            return Ok(_grievanceService.GetAllGrievances());
        }

        [Authorize(Roles = "SupervisoryOfficer")]
        [HttpGet("escalated")]
        public IActionResult GetEscalatedGrievances()
        {
            return Ok(_grievanceService.GetEscalatedGrievances());
        }

        [Authorize(Roles = "SupervisoryOfficer")]
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignOfficer(int id, AssignOfficerDto dto)
        {
            int supervisorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.AssignOfficer(id, dto.OfficerUserId, supervisorId);

            await TriggerStatusNotification(id, "StatusChange", "An officer has been assigned to handle your case.");

            return Ok($"Grievance {id} assigned to officer {dto.OfficerUserId}");
        }

        [Authorize(Roles = "SupervisoryOfficer")]
        [HttpPut("{id}/close")]
        public async Task<IActionResult> CloseGrievance(int id, CloseGrievanceDto dto)
        {
            int supervisorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            _grievanceService.CloseGrievance(id, supervisorId, dto.Feedback);

            await TriggerStatusNotification(id, "StatusChange", "Your grievance has been officially closed by the supervisor.");

            return Ok("Grievance closed successfully by Supervisor");
        }

        private async Task TriggerStatusNotification(int grievanceId, string type, string message)
        {
            var grievance = await _context.Grievances
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == grievanceId);

            if (grievance != null)
            {
                await GrievanceNotificationQueue.Channel.Writer.WriteAsync(new GrievanceNotificationEvent
                {
                    UserId = grievance.CitizenId.ToString(),
                    GrievanceId = grievanceId,
                    Type = type,
                    Message = message
                });
            }
        }
    }
}






















































































