# SagiOS - Voice-Activated Web Operating System

## Overview

SagiOS is a web-based operating system with an integrated AI voice assistant. It provides a desktop-like experience in the browser, featuring voice activation ("Hey, Sagi"), built-in applications (Browser, File Manager, Notes, Calculator, Settings), and a modern UI inspired by Windows 11 and macOS design patterns.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, designed to run on Replit with PostgreSQL database support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Client-side routing handled through component state management rather than traditional routing libraries

**UI Component System**
- shadcn/ui component library with Radix UI primitives as the foundation
- Tailwind CSS for styling with custom design tokens for light/dark themes
- Custom CSS variables for consistent spacing, colors, and elevation effects
- Component structure follows atomic design principles (ui components → app components → os components)

**State Management**
- React Query (@tanstack/react-query) for server state and data fetching
- Local component state with React hooks for UI state
- No global state management library (Redux/Zustand) - relies on prop drilling and composition

**Voice Integration**
- Web Speech API (SpeechRecognition and SpeechSynthesis) for voice input/output
- Wake word detection ("Hey, Sagi") implemented in VoiceAssistant component
- Voice commands route to application navigation system

**Desktop Environment**
- Desktop component acts as the shell/orchestrator
- Screen-based navigation system (home, browser, calculator, notes, files, settings)
- Window management system with draggable, resizable windows (Window component)
- Status bar, taskbar, and side menu for navigation
- Widget-based home screen with calendar, weather, and quick actions

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- HTTP server creation with Node's built-in http module
- Middleware stack: JSON parsing, URL encoding, request logging

**Database Layer**
- Drizzle ORM as the database abstraction layer
- PostgreSQL as the primary database (via @neondatabase/serverless)
- Schema defined in shared/schema.ts for type safety across client/server
- Database configuration in drizzle.config.ts
- Memory storage fallback (MemStorage class) for development without database

**API Design**
- RESTful API structure (routes prefixed with /api)
- Storage interface pattern (IStorage) for data operations abstraction
- Currently implements basic user CRUD operations
- Extensible route registration system in registerRoutes function

**Build & Deployment**
- Custom build script (script/build.ts) using esbuild for server and Vite for client
- Server dependencies bundled using allowlist approach to reduce cold start times
- Static file serving in production mode
- HMR (Hot Module Replacement) in development via Vite middleware

**Development Environment**
- Replit-specific plugins for error overlays and dev tooling
- Environment-based configuration (NODE_ENV)
- TypeScript compilation without emit (type checking only)

### Design System

**Theme Architecture**
- CSS custom properties for light/dark mode theming
- Color system based on HSL values with semantic naming (primary, secondary, muted, accent, destructive)
- Elevation system using CSS variables (--elevate-1, --elevate-2)
- Typography hierarchy using system fonts (Segoe UI, SF Pro Display)
- Border radius tokens (lg: 9px, md: 6px, sm: 3px)

**Component Styling Patterns**
- Utility-first approach with Tailwind
- Component variants using class-variance-authority (cva)
- Hover and active states with elevation classes (hover-elevate, active-elevate-2)
- Backdrop blur effects for glass-morphism UI elements
- Shadow system (shadow-xs, shadow-sm, shadow-2xl)

## External Dependencies

### UI & Design
- **Radix UI**: Headless component primitives (dialogs, popovers, dropdowns, etc.) for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component system on top of Radix UI
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Data & Forms
- **React Query**: Server state management and data fetching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod

### Database
- **Drizzle ORM**: Type-safe ORM for database operations
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- **Neon Database**: PostgreSQL hosting service (implied by driver choice)

### Authentication & Sessions
- **Passport.js**: Authentication middleware (passport, passport-local)
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store
- **memorystore**: In-memory session fallback
- **jsonwebtoken**: JWT token handling
- **bcrypt**: Password hashing (implied by authentication setup)

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific error handling
- **@replit/vite-plugin-cartographer**: Code navigation tool
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Utilities
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **uuid**: UUID generation
- **clsx** & **tailwind-merge**: Conditional className utilities

### Potential Future Integrations
- **OpenAI**: AI/LLM integration (dependency present but not implemented)
- **Google Generative AI**: Alternative AI provider
- **Stripe**: Payment processing
- **Nodemailer**: Email functionality
- **WebSocket (ws)**: Real-time communication
- **Multer**: File upload handling
- **XLSX**: Spreadsheet operations