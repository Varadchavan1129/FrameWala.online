# Contributing Guidelines

## Team Responsibilities

- `vedanti-ui-ux`: Vedanti Pawar — UI/UX design
- `aparna-frontend`: Aparna — frontend development
- `pankaj-requirements`: Pankaj Gode — requirements gathering and client communication
- `varad-integration`: Varad Chavan — integration logic, testing, and main branch coordination
- `rohit-backend-admin`: Rohit Hegadmal — backend, database, and admin module

## Branch Naming Rules

Each team member must work exclusively on their assigned branch:
- `vedanti-ui-ux`
- `aparna-frontend`
- `pankaj-requirements`
- `varad-integration`
- `rohit-backend-admin`

Do not directly modify `main`. `main` is the protected production branch.

## Pull Request Workflow

1. Each member works only on their assigned branch.
2. Pull the latest changes before starting work.
3. Commit changes with clear messages.
4. Push changes to their own branch.
5. Create a Pull Request to `varad-integration` (the integration branch).

## Commit Message Guidelines

- Commit changes with clear, descriptive messages explaining what was changed and why.

## Testing Requirements

- All changes must be tested locally before creating a Pull Request.
- Varad is responsible for reviewing and testing the changes in the `varad-integration` branch.

## Merge Rules

- All team branches should merge into `varad-integration` after review.
- Varad reviews and tests the changes.
- After successful testing, merge the team branches into `varad-integration`.
- Merge `varad-integration` into `main` only after the complete application is stable, tested, and compatible. Only tested and compatible code is allowed in `main`.
