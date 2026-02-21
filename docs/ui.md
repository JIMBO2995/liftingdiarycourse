# UI Coding Standards

## Component Library

This project uses **shadcn/ui** exclusively for all UI components.

### Rules

1. **ONLY use shadcn/ui components** - Do not create custom components
2. **No custom UI components** - All UI must be built using shadcn/ui primitives
3. If a component doesn't exist in shadcn/ui, compose existing shadcn/ui components together

### Installing Components

```bash
npx shadcn@latest add <component-name>
```

### Available Components

See the full list at: https://ui.shadcn.com/docs/components

## Date Formatting

All date formatting must use **date-fns**.

### Format Pattern

Dates should be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Mar 2024
```

### Implementation

```typescript
import { format } from "date-fns";

// Use the 'do MMM yyyy' format
const formattedDate = format(date, "do MMM yyyy");
```

### Examples

| Date | Output |
|------|--------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-03-04 | 4th Mar 2024 |
| 2025-05-21 | 21st May 2025 |
| 2025-06-22 | 22nd Jun 2025 |
| 2025-07-23 | 23rd Jul 2025 |
