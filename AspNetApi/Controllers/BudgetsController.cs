using ExpenceManagement.Api.Data;
using ExpenceManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenceManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BudgetsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> GetAll()
        {
            var items = await _db.Budgets.AsNoTracking().ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Budget>> GetById(int id)
        {
            var item = await _db.Budgets.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Budget>> Create(Budget budget)
        {
            _db.Budgets.Add(budget);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = budget.Id }, budget);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Budget budget)
        {
            if (id != budget.Id) return BadRequest();
            var exists = await _db.Budgets.AnyAsync(b => b.Id == id);
            if (!exists) return NotFound();
            _db.Entry(budget).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Budgets.FindAsync(id);
            if (item == null) return NotFound();
            _db.Budgets.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}



