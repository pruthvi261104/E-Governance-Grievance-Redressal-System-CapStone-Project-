using E_Governance_System.Data;
using E_Governance_System.Helpers;
using E_Governance_System.Models.DTOs;
using E_Governance_System.Models.Entities;
using E_Governance_System.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;

namespace E_Governance_System.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwt;

        public AuthService(ApplicationDbContext context, JwtHelper jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // =========================
        // HELPER: COMPUTE SHA256 HASH
        // =========================
        private string ComputeHash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // =========================
        // REGISTER USER
        // =========================
        public void Register(RegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                throw new Exception("User already exists");

            var citizenRole = _context.Roles.First(r => r.Name == "Citizen");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = ComputeHash(dto.Password),
                RoleId = citizenRole.Id,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();
        }


        // =========================
        // LOGIN USER
        // =========================
        public string Login(LoginDto dto)
        {
            // Fetch user with role
            var user = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !user.IsActive)
                throw new Exception("Invalid credentials");

            // Compute hash and compare
            var computedHash = ComputeHash(dto.Password);
            if (computedHash != user.PasswordHash)
                throw new Exception("Invalid credentials");

            // Generate JWT with Role info
            return _jwt.GenerateToken(user);
        }
    }
}
