# Overview

StockDash is a full-stack stock market dashboard application built with React and Express. The application provides real-time stock market data, including individual stock quotes, market indices, and a personal watchlist feature. Users can search for stocks, view detailed information, and track their favorite stocks through an intuitive web interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and better developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI components with shadcn/ui for consistent, accessible design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire application
- **API Design**: RESTful API endpoints for stock data, market indices, and watchlist management
- **Development Setup**: Hot reload with Vite middleware integration for seamless full-stack development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development and testing
- **Data Models**: Structured schemas for stocks, market indices, and watchlist items with proper relationships

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Basic session-based authentication without complex user management

## External Service Integrations
- **Stock Data Provider**: Alpha Vantage API for real-time stock quotes and company information
- **API Management**: Environment-based API key configuration with fallback to demo mode
- **Data Refresh**: Configurable refresh intervals for market data (30 seconds for stocks, 5 minutes for indices)

## Key Architectural Decisions

### Shared Schema Approach
The application uses a shared schema directory (`/shared`) that contains TypeScript type definitions and Zod schemas. This ensures type consistency between frontend and backend while providing runtime validation.

### Modular Storage Interface
The storage layer implements an interface-based design allowing for easy switching between in-memory storage (development) and PostgreSQL (production) without changing business logic.

### Component-Based UI Architecture
Frontend follows a component-based architecture with reusable UI components, custom hooks for state management, and separation of concerns between data fetching and presentation.

### Development-Friendly Setup
The application includes development-specific tools like runtime error overlays, cartographer for code navigation, and integrated Vite middleware for hot reloading.

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework with hooks and functional components
- **Express.js**: Backend web application framework
- **TypeScript**: Type safety across the entire application stack

## Database and ORM
- **PostgreSQL**: Primary database (configured via Drizzle)
- **Drizzle ORM**: Type-safe database operations and query building
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments

## State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **Zod**: Runtime type validation and schema definition

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## External APIs
- **Alpha Vantage API**: Stock market data provider for real-time quotes and company information

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration