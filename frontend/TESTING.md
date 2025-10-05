# Testing Setup

This project uses Jest for testing React components and utility functions.

## Setup

The testing setup includes:

- **Jest**: JavaScript testing framework
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation
- **jest-environment-jsdom**: DOM environment for Jest

## Configuration

- `jest.config.js`: Main Jest configuration
- `jest.setup.js`: Global test setup and mocks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized in `__tests__` directories alongside the components they test:

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   └── Input.test.tsx
│   └── ui/
└── lib/
    ├── __tests__/
    │   └── utils.test.ts
    └── utils.ts
```

## Writing Tests

### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Utility Function Tests

```tsx
import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
})
```

## Coverage

The project has coverage thresholds set at 70% for:
- Branches
- Functions
- Lines
- Statements

## Mocks

Global mocks are set up in `jest.setup.js` for:
- Next.js router
- Next.js navigation
- Window.matchMedia
- IntersectionObserver
- ResizeObserver

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (getByRole, getByLabelText, etc.)
3. **Test accessibility** where relevant
4. **Keep tests simple and focused**
5. **Use descriptive test names**
6. **Mock external dependencies**
7. **Test error states and edge cases**

