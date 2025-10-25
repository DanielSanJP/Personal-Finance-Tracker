# Personal Finance Tracker - Implementation Guide

## Architecture Overview

This document describes the technical implementation of the Personal Finance Tracker web application.

## Technology Stack

### Core Framework

- **Next.js 15.5.3**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript 5**: Type-safe JavaScript

### Styling & UI

- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Re-usable component library (Radix UI primitives)
- **next-themes 0.4.6**: Dark mode support
- **lucide-react**: Icon library
- **Geist fonts**: Typography (sans + mono)

### State Management & Data Fetching

- **TanStack Query 5.87.4**: Server state management
- **TanStack Query Devtools**: Development debugging
- **Supabase Client 2.54.0**: Database client
- **Supabase SSR 0.6.1**: Server-side rendering support

### AI & Advanced Features

- **@google/generative-ai 0.24.1**: Gemini API for voice input and receipt scanning
- **jspdf 3.0.1**: PDF generation for reports
- **jspdf-autotable 5.0.2**: Table formatting in PDFs

### Form & Data Management

- **react-day-picker 9.8.1**: Date picker component
- **recharts 2.15.4**: Data visualization charts
- **sonner 2.0.6**: Toast notifications
- **date-fns 4.1.0**: Date manipulation

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   ├── api/               # API routes
│   │   ├── receipt-scan/  # Receipt scanning endpoint
│   │   └── speech-to-text/# Voice input endpoint
│   ├── dashboard/         # Dashboard page
│   ├── transactions/      # Transactions list + add
│   ├── accounts/          # Accounts management
│   ├── budgets/           # Budgets management
│   ├── goals/             # Goals management
│   ├── preferences/       # User preferences page
│   ├── profile/           # User profile
│   ├── reports/           # Financial reports
│   ├── settings/          # App settings
│   ├── guides/            # User guides
│   ├── help/              # Help & support
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # Reusable React components
│   ├── ui/                # shadcn/ui components
│   ├── accounts/          # Account-specific components
│   ├── budgets/           # Budget-specific components
│   ├── dashboard/         # Dashboard widgets
│   ├── goals/             # Goal-specific components
│   ├── preferences/       # Preferences components
│   ├── transactions/      # Transaction components
│   └── forms/             # Shared form components
├── hooks/                 # Custom React hooks
│   ├── queries/           # TanStack Query hooks (GET)
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useAccounts.ts
│   │   ├── useBudgets.ts
│   │   ├── useGoals.ts
│   │   ├── useProfile.ts
│   │   ├── usePreferences.ts
│   │   └── useDashboard.ts
│   └── mutations/         # TanStack Query hooks (POST/PUT/DELETE)
│       ├── useTransactionMutations.ts
│       ├── useAccountMutations.ts
│       └── usePreferencesMutations.ts
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client setup
│   │   ├── client.ts      # Browser client
│   │   └── server.ts      # Server client
│   ├── query-client.ts    # React Query client
│   ├── query-keys.ts      # Query key factory
│   └── utils.ts           # Shared utilities (cn, formatters)
├── providers/             # React context providers
│   ├── query-provider.tsx # TanStack Query provider
│   └── theme-provider.tsx # next-themes provider
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types
├── constants/             # App constants
│   ├── categories.ts      # Transaction categories
│   └── business-mapping.ts# Merchant name standardization
└── middleware.ts          # Next.js middleware (auth)
```

## Database Schema

### Supabase PostgreSQL Tables

#### 1. users

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  initials text,
  avatar text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### 2. accounts

```sql
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  balance numeric(12, 2) DEFAULT 0,
  type text,
  account_number text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### 3. transactions

```sql
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  date timestamp with time zone NOT NULL,
  description text,
  amount numeric(12, 2) NOT NULL,
  category text,
  type text CHECK (type IN ('income', 'expense', 'transfer')),
  from_party text,
  to_party text,
  destination_account_id uuid REFERENCES public.accounts(id),
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### 4. budgets

```sql
CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  budget_amount numeric(12, 2) NOT NULL,
  spent_amount numeric(12, 2) DEFAULT 0,
  period text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### 5. goals

```sql
CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric(12, 2) NOT NULL,
  current_amount numeric(12, 2) DEFAULT 0,
  target_date timestamp with time zone,
  category text,
  priority text,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### 6. user_preferences

```sql
CREATE TABLE public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'Light' CHECK (theme IN ('Light', 'Dark', 'system')),
  currency text DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  language text DEFAULT 'English' CHECK (language IN ('English', 'Español', 'Français', 'Deutsch', 'Italiano')),
  email_notifications boolean DEFAULT true,
  budget_alerts boolean DEFAULT true,
  goal_reminders boolean DEFAULT false,
  weekly_reports boolean DEFAULT true,
  show_account_numbers boolean DEFAULT false,
  compact_view boolean DEFAULT false,
  show_cents boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own data"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Database Triggers

#### Auto-create preferences on user signup

```sql
CREATE TRIGGER create_user_preferences_on_signup
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_user_preferences();
```

## State Management

### React Query Configuration

**Query Client Setup** (`src/lib/query-client.ts`):

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Query Keys Factory** (`src/lib/query-keys.ts`):

- Organized by feature (auth, transactions, accounts, budgets, goals, preferences)
- Hierarchical structure for granular cache invalidation
- Type-safe query keys

### Data Flow

1. **User Action** → Component calls mutation hook
2. **Optimistic Update** → UI updates immediately
3. **API Call** → Supabase client sends request
4. **Cache Invalidation** → React Query refetches affected data
5. **UI Re-render** → Components reflect new data

## Authentication Flow

### Login

1. User submits email/password
2. `supabase.auth.signInWithPassword()`
3. Session stored in cookie (via Supabase SSR)
4. Redirect to dashboard
5. `useAuth` hook provides user data to components

### Guest Mode

- Implemented via special guest user check in `useAuth`
- Guest users can view data but mutations are blocked
- Guest protection utility prevents write operations

### Protected Routes

- Middleware checks authentication status
- Redirects unauthenticated users to login
- Guest users allowed but with limited permissions

## Theme Implementation

### Theme Provider Setup

```typescript
// src/providers/theme-provider.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### Theme Toggle Component

- Sun/Moon icon button in navigation
- Syncs with user preferences in database
- Works for both authenticated and guest users
- Persists across sessions via localStorage + database
- Three modes: Light, Dark, System (auto-detect OS preference)

### CSS Variables & Tailwind Configuration

Tailwind CSS 4 configured with custom theme variables and dark mode support:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class", // Uses .dark class on <html> element
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        // ... additional theme colors
      },
    },
  },
};
```

### Theme-Aware Components

All 95+ files across the application use theme-aware CSS variables instead of hardcoded colors:

**Color Mapping Strategy**:

- Text colors: `text-gray-*` → `text-foreground` or `text-muted-foreground`
- Backgrounds: `bg-white`, `bg-gray-50` → `bg-card`, `bg-muted`, `bg-background`
- Borders: `border-gray-*` → `border-border`
- Primary colors: `text-blue-*`, `bg-blue-*` → `text-primary`, `bg-primary`
- Interactive states: All hover/focus states use theme variables

**Files Updated**:

- 18 component files (dashboard, transactions, accounts, budgets, goals, etc.)
- 52 guide system files (GuideStep component + all pages)
- 9 app pages (home, accounts/add, budgets, etc.)

### No Hardcoded Colors

The entire application respects the selected theme across:

- All pages and routes
- All components (forms, cards, modals, dialogs)
- All interactive elements (buttons, links, inputs)
- All guide pages and documentation
- Loading states and empty states
- Charts and data visualizations
- Error and success messages

## API Routes

### Receipt Scanning (`/api/receipt-scan`)

1. Receives image file
2. Converts to base64
3. Sends to Gemini Vision API
4. Extracts merchant, amount, date, items
5. Returns structured JSON

### Speech-to-Text (`/api/speech-to-text`)

1. Receives audio blob
2. Converts to base64
3. Sends to Gemini API
4. Extracts transaction details
5. Returns parsed data

## Component Patterns

### Page Components

- Use `"use client"` directive
- Handle loading states
- Error boundaries
- Fetch data via custom hooks

### Feature Components

- Located in `components/{feature}/`
- Self-contained with local state
- Accept props for configuration
- Use composition over inheritance

### UI Components

- shadcn/ui components in `components/ui/`
- Highly customizable via props
- Accessible by default (Radix UI)
- Styled with Tailwind

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component
3. **Font Optimization**: Geist fonts loaded via next/font
4. **React Query Caching**: Reduces unnecessary API calls
5. **Debounced Search**: Prevents excessive filtering
6. **Lazy Loading**: Loading components for async operations

## Error Handling

### Client-Side

- Try-catch blocks in mutation handlers
- Toast notifications for user feedback
- Error boundaries for component crashes
- Validation before API calls

### Server-Side

- Supabase error responses
- HTTP status codes
- Error logging (console in development)
- Graceful degradation

## Development Workflow

### Setup

```bash
npm install
npm run dev
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables
3. Deploy (automatic on push to main)

### Environment Variables (Production)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`

## Testing Strategy

### Manual Testing

- User flows (login, add transaction, etc.)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness
- Dark mode verification

### Future: Automated Testing

- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright

## Monitoring & Analytics

### Current

- Console logging in development
- Browser DevTools
- React Query DevTools

### Future

- Error tracking (Sentry)
- Analytics (Google Analytics, Posthog)
- Performance monitoring (Vercel Analytics)

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **RLS**: All database operations secured
3. **Input Validation**: Client and server-side
4. **XSS Prevention**: React's built-in escaping
5. **CSRF Protection**: Supabase handles this
6. **HTTPS**: Required in production

## Troubleshooting

### Common Issues

**Build Errors**:

- Clear `.next` folder
- Delete `node_modules`, run `npm install`

**Auth Issues**:

- Check Supabase environment variables
- Verify RLS policies

**Dark Mode Not Working**:

- Ensure ThemeProvider wraps app
- Check `suppressHydrationWarning` on `<html>`

**API Routes Failing**:

- Verify Gemini API key
- Check network requests in DevTools

## Version History

- **0.1.0** (Oct 25, 2025): Initial implementation with preferences
