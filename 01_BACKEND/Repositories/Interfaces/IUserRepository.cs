using E_Governance_System.Models.Entities;

namespace E_Governance_System.Repositories.Interfaces
{
    public interface IUserRepository: IGenericRepository<User>
    {
        User GetByEmail(string email);
        IEnumerable<User> GetUsersByRole(string roleName);
    }
}
