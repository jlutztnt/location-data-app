# Ground Rules & Context

## Experience Level
- I am a new coder with limited experience.
- Please provide detailed explanations, step-by-step instructions, and relevant references or documentation links.
- I’m eager to learn foundational concepts like APIs, authentication, state management, and deployment.

## Technology & Tools
- **Frontend:** React with Next.js
- **Database**  Supabase or Neo
- **Authentication:** Supabase or Auth.js
- **Storage:** Supabase Storage (S3-like) and Azure Blob Storage
- **Communication/Notifications:** Twilio
- **Email:** Resend
- **Payment:** Stripe for payment processing
- **Deployment:** Vercel
- **Version Control:** GitHub repositories
- **LLM:** OpenAI and Grok
- **Testing (Optional):** Jest for unit tests or Cypress for end-to-end tests

## Coding Languages & Frameworks
- **Primarily:** TypeScript with Next.js
- **Styling:** Tailwind CSS or Chakra UI
- Open to suggestions for best practices, libraries, or frameworks that improve development efficiency and maintainability.

## UX & Design Preferences
- User experience (UX) is critical to me.
- I prefer modern, user-friendly, mobile-first designs with a design system like Material-UI or Chakra
- Aim for basic accessibility (a11y) support (e.g., WCAG 2.1 compliance).

## Preferred Workflow & Explanation Style
- I like to work in smaller, incremental steps and test functionality along the way using `console.log` or a debugger (e.g., VS Code debugger).
- Provide a high-level overview first, then break down each step with relevant code snippets and “why” explanations (e.g., “Why use `useEffect` here?”).
- Summarize and restate the solution to reinforce understanding.

## Constraints & Requirements
- Ensure solutions are compatible with my stack (Supabase, Azure Blob, Twilio, Stripe, Vercel).
- Provide environment variable placeholders (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `STRIPE_SECRET_KEY`) for API keys and secrets.
- Suggest best practices for:
  - **Security:** CORS, input sanitization
  - **Scalability:** Serverless architecture
  - **Maintainability**
- Consider API rate limits or throttling where applicable (e.g., Twilio, Stripe).

## Feedback & Iteration
- I might need additional clarification or alternative approaches if something is confusing.
- Please be patient and ready to iterate on proposed solutions.
- Feel free to suggest alternative tools or methods (e.g., SendGrid instead of Twilio) if my approach could improve.

## Example Flow
1. Ask for clarification if any details are missing or unclear.
2. Provide step-by-step instructions in small, testable increments.
3. Offer recommended troubleshooting steps for common errors (e.g., “Check the console for 404s”).
4. Suggest a quick demo deploy (e.g., Vercel) to test live.
5. End with a recap of the solution and next steps I can take.

## Version Control (GitHub)

### Branching Model
- Maintain a `main` branch for production-ready code.
- Create feature branches (e.g., `feature/login-system`) and merge via Pull Requests (PRs).
- Include a PR template (e.g., “Describe the feature, link issues”).

### Commit Messages
- Follow Conventional Commits (e.g., `feat: add user login`, `fix: resolve auth bug`).

### CI/CD
- Use GitHub Actions for linting, testing, or deploying to Vercel.

## Code Organization & Style

### Folder Structure
- Group code by feature or domain (e.g., `auth/`, `database/`, `utils/`).
- Maintain a clear entry point (e.g., `index.ts` for Next.js pages or components).

### Linting & Formatting
- Use ESLint to catch issues and Prettier for consistent formatting.
- Enforce with Husky pre-commit hooks.

## Security & Compliance

### API Keys & Tokens
- Store in `.env.local` (ignored by Git) or Vercel Environment Variables.
- Keep them out of version control and front-end code unless unavoidable.

### Best Practices
- Follow basic OWASP Top 10 practices (e.g., sanitize inputs, avoid SQL injection with Supabase).

## Internationalization (i18n)
- For multiple languages, use `next-intl` with Next.js.

## Documentation

### In-Code Docs
- Use JSDoc or TypeDoc to generate documentation from comments.

### READMEs & Wikis
- Provide clear setup instructions, dependencies, and usage examples in a `README.md`.
- Include a `CONTRIBUTING.md` for future collaboration.

### UI Docs
- Use Storybook for component documentation if adopting a design system.