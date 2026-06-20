# Contributing to AKYSB Fitness Center Management System

Thank you for your interest in contributing! We welcome contributions from the community.

## Code of Conduct

Please be respectful and professional in all interactions.

## How to Contribute

### 1. Fork the Repository
```bash
git clone https://github.com/zafarazlay/KYSB-fitness-center-management-system.git
cd AKYSB
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the existing code style
- Write clean, readable code
- Add comments where necessary
- Test your changes locally

### 4. Commit Your Changes
```bash
git commit -m "feat: add your feature description"
```

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Describe the changes you made
- Reference related issues
- Include screenshots if applicable

## Development Setup

```bash
# Install dependencies
npm install

# Setup environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Setup database
createdb akysb_fitness
psql -U postgres -d akysb_fitness -f database/schema.sql

# Start development
npm run dev
```

## Project Structure Guidelines

```
backend/src/
├── routes/        # API endpoints
├── controllers/   # Business logic
├── models/        # Database queries
├── middleware/    # Authentication, validation
├── services/      # External integrations
└── utils/         # Helper functions

frontend/src/
├── pages/         # Page components
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── context/       # State management
├── services/      # API calls
└── utils/         # Helper functions
```

## Code Style

### Backend (Node.js)
- Use ES modules (import/export)
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Use meaningful variable names
- 2-space indentation

Example:
```javascript
/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  // implementation
};
```

### Frontend (React)
- Use functional components with hooks
- Use PascalCase for component names
- Use camelCase for props and variables
- Keep components modular and reusable
- 2-space indentation

Example:
```jsx
const LoginPage = () => {
  const [email, setEmail] = useState('');
  
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default LoginPage;
```

## Testing

```bash
# Run all tests
npm run test

# Run specific test
npm run test -- src/components/LoginPage

# Watch mode
npm run test:watch
```

## Linting

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Documentation

- Update README.md if adding new features
- Add comments to complex logic
- Update API documentation for new endpoints
- Keep docs in `/docs` folder organized

## Reporting Issues

When reporting bugs:
1. Use a clear, descriptive title
2. Describe the exact steps to reproduce
3. Provide expected vs actual behavior
4. Include screenshots if applicable
5. Share your environment (OS, Node version, etc.)

## Feature Requests

When suggesting features:
1. Describe the use case
2. Provide examples or mockups
3. Explain the expected behavior
4. Consider performance implications

## Review Process

1. Maintainers will review your PR
2. They may request changes or improvements
3. Address feedback and re-push changes
4. Once approved, your PR will be merged

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open an issue with the `question` label
- Email: support@akysb-fitness.com
- Check existing issues and documentation first

---

Thank you for contributing to AKYSB! 🙏
