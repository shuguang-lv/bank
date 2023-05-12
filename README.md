# Bank

This is a course project for the course SWE 266P of UCI MSWE in spring 2023. It implements a self-contained web app for online banking. The app is built with Next.js, TypeScript, and Tailwind CSS. It uses MySQL as the database (Prisma as the ORM) and is deployed on Vercel.

## System Requirements

[Node.js 16.8](https://nodejs.org/) or later.

## Getting Started

1. Duplicate the `.env` file and rename it to `.env.local`. Then, fill in the environment variables in the file with the JWT secret and database URL we provide you.

2. Install the dependencies: `npm install`

3. Run the database generation: `npm run prisma:generate`

4. Run the database push: `npm run prisma:push`

5. Run the development server: `npm run dev`

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Useful Commands

- `npm run prisma:studio`: Open the Prisma Studio to view and edit the database.
