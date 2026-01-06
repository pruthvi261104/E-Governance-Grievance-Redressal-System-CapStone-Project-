using E_Governance_System.Models.Entities;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace E_Governance_System.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            // ================= ROLES =================
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { Name = "Admin" },
                    new Role { Name = "Citizen" },
                    new Role { Name = "DepartmentOfficer" },
                    new Role { Name = "SupervisoryOfficer" }
                );
            }

            // ================= DEPARTMENTS =================
            if (!context.Departments.Any())
            {
                context.Departments.AddRange(
                    new Department { Name = "Water Supply" },
                    new Department { Name = "Electricity" },
                    new Department { Name = "Roads & Transport" },
                    new Department { Name = "Sanitation" }
                );
            }

            // Save to get Role IDs & Department IDs
            context.SaveChanges();

            // ================= ADMIN USER =================
            if (!context.Users.Any(u => u.Email == "admin@egov.com"))
            {
                var adminRole = context.Roles.First(r => r.Name == "Admin");

                var adminUser = new User
                {
                    FullName = "System Admin",
                    Email = "admin@egov.com",
                    PasswordHash = ComputeHash("Admin@123"), // Use same hash as AuthService
                    RoleId = adminRole.Id,
                    DepartmentId = null,
                    IsActive = true
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            // ================= CATEGORIES =================
            if (!context.Categories.Any())
            {
                var water = context.Departments.First(d => d.Name == "Water Supply");
                var electricity = context.Departments.First(d => d.Name == "Electricity");
                var roads = context.Departments.First(d => d.Name == "Roads & Transport");
                var sanitation = context.Departments.First(d => d.Name == "Sanitation");

                context.Categories.AddRange(
                    new Category { Name = "Water Leakage",DepartmentId = water.Id },
                    new Category { Name = "No Water Supply",DepartmentId = water.Id },

                    new Category { Name = "Power Cut",DepartmentId = electricity.Id },
                    new Category { Name = "Voltage Fluctuation",DepartmentId = electricity.Id },

                    new Category { Name = "Potholes",  DepartmentId = roads.Id },
                    new Category { Name = "Road Damage",  DepartmentId = roads.Id },

                    new Category { Name = "Garbage Collection",DepartmentId = sanitation.Id },
                    new Category { Name = "Drainage Issue",DepartmentId = sanitation.Id }
                );
            }

            context.SaveChanges();
        }

        // ================= HELPER: COMPUTE SHA256 HASH =================
        private static string ComputeHash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
