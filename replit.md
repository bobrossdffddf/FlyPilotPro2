# Aviation Flight Management Application

## Overview

This is a modern aviation flight management application built with a React frontend and Express.js backend. The application provides cabin crew with tools to manage passenger announcements, aviation charts, Standard Instrument Departures (SIDs), flight checklists, and notepad functionality. It features a dark aviation-themed UI with specialized color schemes designed for cockpit environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development experience
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and data synchronization
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom aviation-themed color variables
- **Class Variance Authority** for component variant management

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **RESTful API design** with endpoints organized by feature (announcements, checklists, notes, charts, SIDs)
- **Drizzle ORM** for database operations with type-safe schema definitions
- **Zod** for runtime validation and schema parsing
- **In-memory storage interface** with potential for database integration

### Data Storage
- **PostgreSQL** configured as the primary database via Drizzle
- **Neon Database** serverless PostgreSQL for cloud deployment
- **Schema-first approach** with shared TypeScript types between frontend and backend
- **Migration support** through Drizzle Kit for database schema changes

### Component Architecture
- **Modular tab-based interface** with separate components for each major feature
- **Reusable UI components** following atomic design principles
- **Custom hooks** for audio playback, mobile detection, and toast notifications
- **Context providers** for theme management and global state

### Key Features
- **Professional PA System**: ElevenLabs voice synthesis with airline-specific accents and dual language support
- **ATC Radar Display**: Real-time aircraft tracking with popout capabilities using ATC24 data
- **Aviation Charts Library**: Professional chart management with 19 chart types and popout viewing
- **Aircraft Checklists**: Interactive checklists for 20+ aircraft types with progress tracking
- **Weight & Balance Calculator**: Professional W&B calculations with real aircraft specifications
- **Flight Log & Notes**: Flight-specific note management with persistent storage

### Styling System
- **Aviation-themed design** with cockpit-inspired dark color scheme
- **CSS custom properties** for consistent theming across components
- **Responsive design** with mobile-first approach using Tailwind breakpoints
- **Custom fonts** including Inter for UI text and JetBrains Mono for monospace elements

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React 18, React DOM, React Query for state management
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Modern build tool with plugin ecosystem including React and error overlay plugins

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional className utility

### Backend Services
- **Express.js**: Web framework with JSON and URL-encoded body parsing
- **Drizzle**: Type-safe ORM with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL provider
- **Zod**: Schema validation library for runtime type checking

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Drizzle Kit**: Database migration and introspection tool
- **Replit plugins**: Development environment integration and error handling

### Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries
- **Date-fns**: Modern date utility library for timestamp handling

### Additional Utilities
- **cmdk**: Command menu component for search interfaces
- **embla-carousel**: Touch-friendly carousel component
- **nanoid**: URL-safe unique ID generator
- **wouter**: Minimalist routing library for React