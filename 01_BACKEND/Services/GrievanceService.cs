using E_Governance_System.Data;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;
using E_Governance_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Services
{
    public class GrievanceService : IGrievanceService
    {
        private readonly ApplicationDbContext _context;

        public GrievanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public object CreateGrievance(GrievanceCreateDto dto, int userId)
        {
            var category = _context.Categories
                .Include(c => c.Department)
                .FirstOrDefault(c => c.Id == dto.CategoryId);

            if (category == null) throw new Exception("Invalid category");

            var grievance = new Grievance
            {
                Title = dto.Title,
                Description = dto.Description,
                CitizenId = userId,
                CategoryId = category.Id,
                DepartmentId = category.DepartmentId,
                Status = "Submitted",
                CreatedAt = DateTime.UtcNow,
                IsEscalated = false
            };

            _context.Grievances.Add(grievance);
            _context.SaveChanges();

            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievance.Id,
                Action = "Submitted",
                Remarks = "Grievance submitted by citizen",
                PerformedById = userId
            });

            _context.SaveChanges();
            return new { grievance.Id, grievance.Status };
        }

        public List<GrievanceResponseDto> GetByCitizen(int userId)
        {
            return _context.Grievances.Include(g => g.Category).Include(g => g.Department)
                .Include(g => g.AssignedTo).Where(g => g.CitizenId == userId)
                .Select(MapToDto).ToList();
        }

        public List<GrievanceResponseDto> GetByDepartment(int departmentId)
        {
            return _context.Grievances.Include(g => g.Category).Include(g => g.Department)
                .Include(g => g.AssignedTo).Where(g => g.DepartmentId == departmentId)
                .Select(MapToDto).ToList();
        }

        public void AssignOfficer(int grievanceId, int officerUserId, int supervisorId)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new Exception("Grievance not found");

            var officerExists = _context.Users.Any(u => u.Id == officerUserId);
            if (!officerExists) throw new Exception($"User with ID {officerUserId} does not exist.");

            grievance.AssignedToId = officerUserId;
            grievance.Status = "Assigned";

            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                Action = "Assigned",
                Remarks = "Assigned by supervisory officer",
                PerformedById = supervisorId, // Correctly using the passed supervisorId
                ActionAt = DateTime.UtcNow
            });

            _context.SaveChanges();
        }

        public void MarkInReview(int grievanceId, int officerId, string remarks)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new KeyNotFoundException("Grievance not found");

            grievance.Status = "InReview";
            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                PerformedById = officerId,
                Action = "InReview",
                Remarks = remarks,
                ActionAt = DateTime.UtcNow
            });
            _context.SaveChanges();
        }

        public void ResolveGrievance(int grievanceId, string remarks, int userId)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new Exception("Grievance not found");

            grievance.Status = "Resolved";
            grievance.ResolvedAt = DateTime.UtcNow;

            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                Action = "Resolved",
                Remarks = remarks ?? "Grievance resolved",
                PerformedById = userId,
                ActionAt = DateTime.UtcNow
            });
            _context.SaveChanges();
        }

        public void EscalateGrievance(int grievanceId, int userId)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new Exception("Grievance not found");

            if (grievance.Status != "Resolved")
                throw new Exception("You can only escalate after a 'Resolved' outcome.");

            grievance.IsEscalated = true;
            grievance.Status = "Escalated";

            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                Action = "Escalated",
                Remarks = "Grievance escalated by citizen",
                PerformedById = userId, // Citizen performs the escalation
                ActionAt = DateTime.UtcNow
            });
            _context.SaveChanges();
        }

        public void CloseGrievance(int grievanceId, int supervisorId, string feedback)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new Exception("Grievance not found");

            // Only Supervisor can close now
            if (grievance.Status != "Resolved" && grievance.Status != "Escalated")
                throw new Exception("Grievance must be Resolved or Escalated to be closed.");

            grievance.Status = "Closed";
            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                Action = "Closed",
                Remarks = feedback ?? "Closed by Supervisory Officer",
                PerformedById = supervisorId // Supervisor performs the closure
            });
            _context.SaveChanges();
        }

        public void ReopenGrievance(int grievanceId, int citizenId, string reason)
        {
            var grievance = _context.Grievances.Find(grievanceId);
            if (grievance == null) throw new Exception("Grievance not found");

            if (grievance.Status != "Escalated" && grievance.Status != "Resolved")
                throw new Exception("Must be Resolved or Escalated to reopen.");

            grievance.Status = "Reopened";
            grievance.IsEscalated = false;

            _context.GrievanceHistories.Add(new GrievanceHistory
            {
                GrievanceId = grievanceId,
                Action = "Reopened",
                Remarks = reason ?? "Citizen still not satisfied",
                PerformedById = citizenId,
                ActionAt = DateTime.UtcNow
            });
            _context.SaveChanges();
        }

        public List<GrievanceResponseDto> GetAllGrievances()
        {
            return _context.Grievances.Include(g => g.Category).Include(g => g.Department)
                .Include(g => g.AssignedTo).Select(MapToDto).ToList();
        }

        public List<GrievanceResponseDto> GetEscalatedGrievances()
        {
            return _context.Grievances.Include(g => g.Category).Include(g => g.Department)
                .Include(g => g.AssignedTo).Where(g => g.IsEscalated).Select(MapToDto).ToList();
        }

        private GrievanceResponseDto MapToDto(Grievance g)
        {
            return new GrievanceResponseDto
            {
                GrievanceId = g.Id,
                Title = g.Title,
                Description = g.Description,
                Status = g.Status,
                CategoryName = g.Category.Name,
                DepartmentName = g.Department.Name,
                AssignedOfficerName = g.AssignedTo?.FullName,
                CreatedAt = g.CreatedAt,
                IsEscalated = g.IsEscalated
            };
        }
    }
}