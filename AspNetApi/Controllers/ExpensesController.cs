using ExpenceManagement.Api.Data;
using ExpenceManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenceManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ExpensesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
        {
            var items = await _db.Expenses.AsNoTracking().ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Expense>> GetById(int id)
        {
            var item = await _db.Expenses.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> Create(Expense expense)
        {
            var budgetExists = await _db.Budgets.AnyAsync(b => b.Id == expense.BudgetId);
            if (!budgetExists)
            {
                return BadRequest("Invalid BudgetId");
            }
            _db.Expenses.Add(expense);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Expense expense)
        {
            if (id != expense.Id) return BadRequest();
            var exists = await _db.Expenses.AnyAsync(e => e.Id == id);
            if (!exists) return NotFound();
            _db.Entry(expense).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Expenses.FindAsync(id);
            if (item == null) return NotFound();
            _db.Expenses.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}



