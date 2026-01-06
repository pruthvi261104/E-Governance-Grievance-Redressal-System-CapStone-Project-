using E_Governance_System.Models.DTOs;

namespace E_Governance_System.Services.Interfaces
{
    public interface IGrievanceService
    {
        object CreateGrievance(GrievanceCreateDto dto, int userId);
        List<GrievanceResponseDto> GetByCitizen(int userId);
        List<GrievanceResponseDto> GetByDepartment(int departmentId);
        List<GrievanceResponseDto> GetAllGrievances();
        List<GrievanceResponseDto> GetEscalatedGrievances();

        // Pass supervisorId to track who performed the assignment
        void AssignOfficer(int grievanceId, int officerUserId, int supervisorId);

        void MarkInReview(int grievanceId, int officerId, string remarks);
        void ResolveGrievance(int grievanceId, string remarks, int userId);
        void EscalateGrievance(int grievanceId, int userId);

        // Closing is now restricted to the Supervisor
        void CloseGrievance(int grievanceId, int supervisorId, string feedback);

        void ReopenGrievance(int grievanceId, int citizenId, string reason);
    }
}