namespace ExpenceManagement.Api.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Limit { get; set; }
    }
}



