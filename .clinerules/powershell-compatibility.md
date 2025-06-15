## Brief overview
Guidelines for PowerShell compatibility when working on Windows development environments. These rules ensure commands execute properly in PowerShell terminals.

## Command chaining syntax
- Use semicolon (;) instead of && for command chaining in PowerShell
- PowerShell does not support && as a conditional command separator like Bash
- Example: Use `cd backend; npm install` instead of `cd backend && npm install`
- For strict conditional chaining, use PowerShell-native syntax: `Command1; if ($LASTEXITCODE -eq 0) { Command2 }`

## Terminal behavior awareness
- Each execute_command runs in a new terminal instance
- Directory changes (cd) do not persist between separate commands
- Combine directory navigation with the target command in a single execution when needed

## Development workflow
- Test commands in PowerShell-compatible syntax before execution
- Be aware that some Unix-style commands may not work directly in PowerShell
- Consider PowerShell equivalents for common operations when necessary
