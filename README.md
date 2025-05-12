# Multi-User Delivery Service Platform

A comprehensive web application for managing delivery services, built with Next.js, PostgreSQL, and Shadcn components.

## Overview

This platform allows users to register as drivers, vendors, and clients, facilitating a seamless delivery service experience. It's designed to handle user management using PostgreSQL, with a modern and responsive frontend powered by Next.js and Shadcn components.

## Features

### User Registration and Management
- Multiple user types: Drivers, Vendors, and Clients
- Secure authentication and authorization

### Fast and Reliable Delivery Solutions
- Same-day delivery
- On-demand services
- Emergency last-minute deliveries

### On-the-Go Courier Assistance
- Quick pickup and delivery
- Experienced and trained couriers

### Catering Delivery & Setup
- Event planning assistance
- Food transport and presentation services

### Versatile Delivery Options
- Handling various items beyond food (documents, medical supplies, etc.)
- Ensuring safe and timely deliveries

### Priority Handling for Urgent Requests
- Rapid response to time-sensitive deliveries

### Professional Standards
- Comprehensive driver training programs
- HIPAA compliance
- Food Handlers Certification (California standards)
- Strict dress code and safety protocols

## Technical Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Shadcn

## Getting Started

[Include installation and setup instructions here]

## Documentation

[Link to or include basic documentation about how to use the platform]

## Blog

Stay updated with our latest news and valuable information about our services through our blog section.

## Contributing

[Include information about how others can contribute to the project, if applicable]

## License

[Specify the license under which your project is released]

## Contact

[Provide contact information or links for support and inquiries]

## Highlight.run Integration

This project is configured with [Highlight.run](https://www.highlight.io) for session replay, error monitoring, and fullstack debugging. It uses the official `@highlight-run/next` package for Next.js integration.

### Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
# Highlight.run API Key for sourcemap uploads
HIGHLIGHT_PROJECT_API_KEY=your_api_key_here
```

### Features Enabled

- Session replay to view user interactions
- Frontend error monitoring with automatic sourcemap uploads
- Server-side error tracking and logging
- User identification integrated with authentication system
- React error boundary integration
- Network request tracing
- Full-stack distributed tracing across frontend and backend

### How It Works

- Frontend initialization via `HighlightInit` in `src/app/layout.tsx`
- Server-side tracing through `instrumentation.ts`
- Error boundaries from `@highlight-run/next/client`
- SSR error handling in `src/app/error.tsx`
- Middleware integration for cookie-based session tracking
- API route wrapping with `withAppRouterHighlight`
- User identification in `src/contexts/UserContext.tsx`
- Sourcemaps are uploaded during the build process

To view your application sessions and errors, visit [app.highlight.io](https://app.highlight.io).