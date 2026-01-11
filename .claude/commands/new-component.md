---
description: Create a new React component following project patterns
allowed-tools: Write, Read
argument-hint: ComponentName
---

# Create New React Component

Create a new React component called: **$ARGUMENTS**

## Requirements

1. **Read the frontend patterns** from `/frontend/.claude/CLAUDE.md`

2. **Follow the design system** from `/frontend/DESIGN-SYSTEM.md`

3. **Create the component** at `frontend/src/components/$ARGUMENTS.tsx`

4. **Apply these patterns**:
   - TypeScript with proper interface definitions
   - Functional component with arrow function
   - Use TanStack Query if fetching data
   - Frosted glass styling: `bg-slate-800/40 backdrop-blur-sm border border-slate-700/50`
   - Include loading skeleton with `animate-pulse`
   - Add hover effects: `hover:bg-slate-800/60 transition-all duration-300`

## Component Template

```tsx
interface ${ARGUMENTS}Props {
  // Define props here
}

const $ARGUMENTS = ({ }: ${ARGUMENTS}Props) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
      {/* Component content */}
    </div>
  );
};

export default $ARGUMENTS;
```

## After Creation

- Show the created file
- Suggest where to import/use it
