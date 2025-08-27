namespace ExpenceManagement.Api.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int BudgetId { get; set; }
        public Budget? Budget { get; set; }
    }
}



