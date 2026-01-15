# Random Links Project

## Project Purpose

The purpose of the Random Links project is to provide a modern, full-stack platform for managing, sharing, and organizing web links with advanced features such as tagging, authentication, permissions. The project aims to:

- Help users save, categorize, and search their favorite links efficiently
- Enable secure access and sharing of links with robust authentication and permission controls
- Offer a user-friendly web interface and a scalable backend API
- Support collaborative features and extensibility for future enhancements

This is a monorepo for the **Random Links** project, containing both backend and frontend applications, as well as shared packages.

## Project Structure

- **apps/backend/**: Node.js backend service (authentication, API, migrations, Prisma ORM)
- **apps/web-app/**: React web application (Vite, Storybook, UI components)
- **packages/**: Shared packages (type-safe errors, lint config)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)

### Install Dependencies

```bash
pnpm install
```

### Running the Backend

```bash
cd apps/backend
pnpm dev
```

### Running the Web App

```bash
cd apps/web-app
pnpm dev
```

### Database Migrations

- Migration files are in `apps/backend/migrations/`.
- Use the CLI tools in `apps/backend/src/cli/` to apply or create migrations.

### Storybook

```bash
cd apps/web-app
pnpm storybook
```

## Packages

- **type-safe-errors**: Utilities for type-safe error handling.
- **oxlint-config**: Shared lint configuration.

## Development

- Use [pnpm workspaces](https://pnpm.io/workspaces) for managing dependencies across packages and apps.
- Lint, format, and test scripts are defined in each package/app as needed.

## License

MIT License
