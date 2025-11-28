# Gov WTF

**Rate Indonesian Government Officials**

A web application that allows Indonesian citizens to rate and provide feedback on government officials' performance. Empowering public discourse through transparent, community-driven evaluations.

## Tech Stack

**Full-Stack Unified Architecture:**
- **Framework:** React Router 7 (full-stack)
- **Styling & Components:** Tailwind CSS, Radix UI
- **Database:** SQLite with Drizzle ORM, LibSQL client
- **Code Quality:** Biome (linting & formatting), Husky (git hooks), lint-staged
## Architecture

Gov WTF is a **full-stack monolith** using React Router 7's unified frontend/backend model:

- **Single Codebase:** Frontend UI and backend API routes coexist in `/app/routes`
- **Unified Rendering:** SSR with React Router's data loaders and actions
- **Shared Database:** Drizzle ORM queries run directly in server-side route handlers
- **Type-Safe:** End-to-end TypeScript from UI components to database operations
- **Developer Experience:** One `bun dev` command for full-stack development with hot reload

This eliminates the frontend/backend separation, reducing API contracts complexity and enabling seamless data flow.

## Project Structure

```
gov-wtf/
├── app/                            # Full-stack application source
│   ├── routes/                    # Route handlers with loaders/actions
│   ├── components/
│   │   ├── shared/                # Reusable components
│   │   │   ├── header.tsx         # Navigation & branding
│   │   │   ├── pagination.tsx     # Pagination controls
│   │   │   └── card/
│   │   │       └── person.tsx     # Official card with rating display
│   │   ├── sections/
│   │   │   └── persons.tsx        # Officials grid/list section
│   │   └── ui/                    # Base UI components
│   ├── db/                         # Database layer
│   │   ├── schema.ts              # Drizzle schema definitions
│   │   ├── index.ts               # Database client initialization
│   │   ├── seed.ts                # Seed data script
│   │   └── migrations/            # Migration files
│   ├── lib/
│   │   └── utils.ts               # Shared utilities
│   ├── app.css                    # Global styles
│   └── root.tsx                   # Root component
├── public/                        # Static assets (images, icons)
├── drizzle.config.ts              # Drizzle ORM configuration
├── vite.config.ts                 # Vite build configuration
├── react-router.config.ts         # React Router full-stack config
├── tsconfig.json                  # TypeScript configuration
├── biome.json                     # Code quality rules
├── Dockerfile                     # Container image definition
└── package.json                   # Dependencies & scripts
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Package Manager:** bun, pnpm, yarn, or npm
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/euxzy/gov-wtf.git
   cd gov-wtf
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or: pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Configure your database connection string (LibSQL/SQLite).

4. **Push database schema:**
   ```bash
   bun db:push
   ```

5. **Seed initial data (optional):**
   ```bash
   bun db:seed
   ```

### Development

Start the dev server with hot reload:

```bash
bun run dev
# or: pnpm dev / yarn dev / npm run dev
```

The app will be available at `http://localhost:5173` (or as configured).

### Build for Production

```bash
bun run build
bun run start
# or: pnpm build && pnpm start / yarn build && yarn start / npm run build && npm start
```

## Key Features

### Rating System
- Users can rate officials with a visual rating component
- Ratings are persisted to the database and linked to sessions
- Aggregate ratings display official performance scores

### Search & Pagination
- Full-text search across official names and positions
- Paginated results (8 officials per page)
- Responsive grid layout

### Database Schema

**Tables:**
- **`functionary`** — Government officials (id, name, position, photo)
- **`voter`** — Anonymous user sessions (id)
- **`rating`** — Rating entries (functionaryId, voterId, rate)

### Session Management
- Anonymous sessions using CUID2 credentials
- Session cookies for user identification without login

## Available Scripts

| Command | bun | pnpm | yarn | npm |
|---------|-----|------|------|-----|
| Start dev server | `bun run dev` | `pnpm dev` | `yarn dev` | `npm run dev` |
| Build for production | `bun run build` | `pnpm build` | `yarn build` | `npm run build` |
| Run production server | `bun run start` | `pnpm start` | `yarn start` | `npm start` |
| Lint code | `bun run lint` | `pnpm lint` | `yarn lint` | `npm run lint` |
| Format code | `bun run format` | `pnpm format` | `yarn format` | `npm run format` |
| Type checking | `bun run typecheck` | `pnpm typecheck` | `yarn typecheck` | `npm run typecheck` |
| Push schema | `bun run db:push` | `pnpm db:push` | `yarn db:push` | `npm run db:push` |
| Open Drizzle Studio | `bun run db:studio` | `pnpm db:studio` | `yarn db:studio` | `npm run db:studio` |
| Generate migration | `bun run db:generate` | `pnpm db:generate` | `yarn db:generate` | `npm run db:generate` |
| Run migrations | `bun run db:migrate` | `pnpm db:migrate` | `yarn db:migrate` | `npm run db:migrate` |
| Seed database | `bun run db:seed` | `pnpm db:seed` | `yarn db:seed` | `npm run db:seed` |

## Database Management

### View Database (Drizzle Studio)
```bash
bun run db:studio
# or: pnpm db:studio / yarn db:studio / npm run db:studio
```
Open `https://local.drizzle.studio` to browse and edit data visually.

### Create New Migration
After updating `app/db/schema.ts`:
```bash
bun run db:generate
# or: pnpm db:generate / yarn db:generate / npm run db:generate
# Review migration in app/db/migrations/
bun run db:push
# or: pnpm db:push / yarn db:push / npm run db:push
```

### Reset Database (Development Only)
```bash
bun run db:migrate:reset
```

## Docker Deployment

Build and run with Docker:

```bash
docker build -t gov-wtf .
docker run -p 3000:3000 -e DATABASE_URL="<your-db-url>" gov-wtf
```

## Route Loaders (Server-Side Data Fetching)

Instead of separate REST APIs, React Router uses **loaders** to fetch data server-side and pass it to components.

### `routes/index.tsx` Loader
**Home page** — Fetches officials with ratings, applies search/pagination filters.

**Query Parameters:**
- `q` — Search term (name or position)
- `page` — Page number (default: 1)

**Loader Function (`loader`):**
```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  // Get or create user session
  const session = await getServiceSession(request.headers.get('Cookie'))
  
  // Query database with search filters and pagination
  const [functionaries, functionaryCount] = await Promise.all([
    db.query.functionary.findMany({ /* ... */ }),
    db.$count(functionary),
  ])
  
  return data({ functionaries, functionaryCount, page, totalPage })
}
```

**Returned Data:**
- `functionaries` — Array of officials with ratings
- `functionaryCount` — Total official count
- `page` — Current page number
- `totalPage` — Total pages for pagination

## Development Best Practices

1. **Code Quality:** Run `bun run lint` (or `pnpm lint` / `yarn lint` / `npm run lint`) before committing (enforced by Husky + lint-staged)
2. **Type Safety:** Use TypeScript strictly end-to-end; run `bun run typecheck`
3. **Formatting:** Auto-format with `bun run format` (or `pnpm format` / `yarn format` / `npm run format`)
4. **Loader Patterns:** Always use React Router loaders for server-side data fetching, not client-side queries
5. **Database Migrations:** Run `bun run db:push` after schema updates; review migrations in `app/db/migrations/`
6. **Component Reusability:** Keep UI components stateless; put data logic in route loaders
7. **Session Management:** Use the session service for user tracking (anonymous CUID2-based)
8. **Git Hooks:** Husky automatically enforces lint/format checks on commit

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "feat: add feature"`
3. Push to GitHub: `git push origin feature/my-feature`
4. Open a Pull Request

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact the maintainers

---

**Made with ❤️ for Indonesian civic engagement**
