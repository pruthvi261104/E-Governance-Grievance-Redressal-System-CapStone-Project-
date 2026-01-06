using System.ComponentModel.DataAnnotations;

namespace E_Governance_System.Models.DTOs
{
    public class GrievanceCreateDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
