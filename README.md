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
2. Enable GitHub Pages in your repository settings:
   - Go to your repository → Settings → Pages
   - Set source to "GitHub Actions"

3. The GitHub Actions workflow will automatically build and deploy your site when you push to the main branch.

### Important Notes About Static Export

When deploying to GitHub Pages:

- The app is exported as static HTML/JS/CSS files
- Dynamic API routes won't work - data should be pre-rendered or fetched from external APIs
- Server-side functions aren't available
- For full functionality, consider deploying to a platform that supports Next.js server components and API routes

### Testing Static Export Locally

```bash
# Build static export
npm run export

# Serve the static files locally
npx serve out
```

## Project Structure

- `/src/app`: Next.js app router components
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations

## License

[MIT](LICENSE)
