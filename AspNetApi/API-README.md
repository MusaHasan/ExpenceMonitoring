# ExpenceManagement.Api

ASP.NET Core 9 Web API for Budgets and Expenses with EF Core (SQLite).

## Run

```bash
cd AspNetApi

dotnet build

dotnet run
```

Swagger UI: http://localhost:5000/swagger or http://localhost:8080/swagger (port varies)

## Endpoints
- Budgets: `GET/POST/PUT/DELETE /api/budgets`
- Expenses: `GET/POST/PUT/DELETE /api/expenses`

The app creates `expence.db` automatically on first run.

