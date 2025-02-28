# Kiosk Admin Dashboard

A Next.js-based admin dashboard for managing kiosks.

## Features

- Modern tech stack with Next.js, TypeScript, and Tailwind CSS
- Responsive design using Shadcn UI components
- Database integration with Prisma ORM
- Authentication and authorization
- Interactive data visualization with Recharts

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nanonymoussu/kiosk-admin-dashboard.git
cd kiosk-admin-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Update the values in `.env.local` with your configuration.

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Setup

### Development

Run the development server in Docker:

```bash
docker-compose up dev
```

### Production

Build and run the production container:

```bash
docker-compose up app
```

## Deployment

### Building for Production

```bash
npm run build
npm start
```

### GitHub Pages Deployment

To deploy to GitHub Pages:

1. Push your code to GitHub
2. Enable GitHub Pages in your repository settings
3. The GitHub Actions workflow will automatically build and deploy your site

You can also manually trigger a deployment:

```bash
# Build for static export
NEXT_OUTPUT=export npm run build

# The output will be in the 'out' directory, which can be deployed to GitHub Pages
```

## Project Structure

- `/src/app`: Next.js app router components
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations

## License

[MIT](LICENSE)
