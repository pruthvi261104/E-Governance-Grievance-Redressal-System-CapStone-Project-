using E_Governance_System.Data;
using E_Governance_System.Models.Entities;
using E_Governance_System.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_Governance_System.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public User GetByEmail(string email)
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefault(u => u.Email == email);
        }

        public IEnumerable<User> GetUsersByRole(string roleName)
        {
            return _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.Name == roleName)
                .ToList();
        }
    }
}
