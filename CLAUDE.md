# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack for fast builds
- `npm run build` - Build the production application  
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

Neural Teach is a Next.js 15 AI-powered learning platform with the following key architectural components:

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism design system
- **Authentication**: Clerk with subscription plan integration
- **Database**: Supabase with PostgreSQL and Row Level Security
- **Voice AI**: Vapi AI for interactive voice learning sessions
- **UI Components**: Radix UI primitives with custom neural-themed styling
- **Forms**: React Hook Form with Zod validation
- **Monitoring**: Sentry for error tracking

### Key App Structure
- `/app` - Next.js App Router pages:
  - `/companions` - Main tutors/companions browsing and management
  - `/companions/[id]` - Individual tutor interaction page
  - `/subscription` - Subscription management and pricing
  - `/dashboard/usage` - Usage analytics and billing
  - `/my-journey` & `/my-progress` - User progress tracking
- `/components` - Reusable React components with glassmorphism design
- `/lib/actions` - Server actions for data operations
- `/types` - TypeScript definitions for tutors, subscriptions, Vapi integration

### Database Schema (Supabase)
- `tutors` - AI learning companions/tutors created by users
- `session_usage` - Voice session tracking with duration and cost
- `user_subscriptions` - User subscription plans and limits
- `bookmarks` - User bookmarked tutors
- `session_history` - User interaction history

### Authentication & Subscriptions
- Clerk handles authentication with plan-based features
- Subscription plans control:
  - Maximum number of tutors user can create
  - Voice session minute limits per month
  - Maximum session duration
- Plan mapping in `lib/clerk-plan-mapping.ts` integrates Clerk roles with features

### Voice Integration (Vapi AI)
- Voice sessions are tracked for billing and usage limits
- Session duration and cost are recorded in `session_usage` table
- Real-time voice interaction with AI tutors
- Voice session permissions checked before starting sessions

### Component Architecture
- Components follow glassmorphism design with neural-inspired patterns
- Subject-based filtering and color coding system
- Responsive design optimized for all devices
- Form components use React Hook Form with Zod validation

### Key Business Logic Files
- `lib/actions/companion.actions.ts` - CRUD operations for tutors
- `lib/actions/subscription.actions.ts` - Subscription and usage management
- `lib/subscription.config.ts` - Subscription plan definitions and billing logic
- `constants/index.ts` - App-wide constants for subjects, voices, teaching styles

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_VAPI_WEB_TOKEN` - Vapi AI web SDK token
- Clerk authentication keys
- Sentry monitoring keys

### Design System
The app uses a custom neural-inspired design with:
- Glassmorphism components with backdrop blur effects
- Subject-specific color coding (science: purple, maths: orange, etc.)
- Smooth animations and transitions
- Dot-pattern neural network backgrounds