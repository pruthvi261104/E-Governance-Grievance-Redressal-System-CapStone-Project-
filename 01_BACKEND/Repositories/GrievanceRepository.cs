using E_Governance_System.Data;
using E_Governance_System.Models.Entities;
using E_Governance_System.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Repositories
{
    public class GrievanceRepository : GenericRepository<Grievance>, IGrievanceRepository
    {
        public GrievanceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<Grievance> GetByCitizen(int citizenId)
        {
            return _context.Grievances
                .Include(g => g.Category)
                .Include(g => g.Department)
                .Where(g => g.CitizenId == citizenId)
                .OrderByDescending(g => g.CreatedAt)
                .ToList();
        }

        public IEnumerable<Grievance> GetByDepartment(int departmentId)
        {
            return _context.Grievances
                .Include(g => g.Category)
                .Include(g => g.Citizen)
                .Where(g => g.DepartmentId == departmentId)
                .OrderBy(g => g.Status)
                .ThenBy(g => g.CreatedAt)
                .ToList();
        }

        public IEnumerable<Grievance> GetEscalatedGrievances()
        {
            return _context.Grievances
                .Include(g => g.Department)
                .Where(g => g.IsEscalated == true)
                .ToList();
        }


    }
}
