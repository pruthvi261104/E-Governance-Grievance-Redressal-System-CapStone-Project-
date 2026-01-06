using E_Governance_System.Models.Entities;

namespace E_Governance_System.Repositories.Interfaces
{
    public interface IGrievanceRepository: IGenericRepository<Grievance>
    {
        IEnumerable<Grievance> GetByCitizen(int citizenId);
        IEnumerable<Grievance> GetByDepartment(int departmentId);
        IEnumerable<Grievance> GetEscalatedGrievances();
    }
}
