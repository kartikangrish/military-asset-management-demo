# Military Asset Management Backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your PostgreSQL database and update `.env` with your credentials.
3. Run Prisma migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build TypeScript
- `npm start` — Run built server
- `npx prisma studio` — Prisma DB browser 