using E_Governance_System.Models.DTOs;

namespace E_Governance_System.Services.Interfaces
{
    public interface IAuthService
    {
        string Login(LoginDto dto);
        void Register(RegisterDto dto);
    }
}
