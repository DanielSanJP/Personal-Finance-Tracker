# Personal Finance Tracker - Product Specification

## Overview

The Personal Finance Tracker is a web-based application built with Next.js that helps users manage their personal finances by tracking transactions, budgets, goals, and accounts. The application features a modern, responsive UI with dark mode support and provides intelligent features like voice input and receipt scanning powered by AI.

## Core Features

### 1. User Authentication & Profiles

- **User Registration**: Email/password authentication via Supabase Auth
- **User Login**: Secure authentication with session management
- **Guest Mode**: Read-only access to explore the app without registration
- **Profile Management**: Users can view and update their profile information
  - First name, last name, initials
  - Avatar (optional)
  - Display name

### 2. Dashboard

- **Financial Overview**: At-a-glance view of financial health
  - Total balance across all accounts
  - Monthly change percentage
  - Monthly income vs expenses
  - Budget remaining
- **Quick Actions**: Fast access to common tasks
  - Add transaction
  - Add account
  - Add budget
  - Add goal
- **Charts & Visualizations**:
  - Spending by category (pie chart)
  - Monthly trends (bar chart)
  - Account breakdown

### 3. Transactions

- **Transaction Management**:
  - Add, edit, delete transactions
  - Support for three transaction types:
    - Income
    - Expense
    - Transfer (between accounts)
  - Universal party system (`from_party`, `to_party`) for merchant tracking
  - Category assignment
  - Date selection
  - Amount entry
  - Description/notes
- **Transaction Views**:
  - List view with filtering
  - Search functionality
  - Sortable columns
- **Smart Input**:
  - Voice-to-text transaction entry (powered by Gemini AI)
  - Receipt scanning with OCR (powered by Gemini Vision)
  - Automatic merchant and amount detection
  - Business name mapping to standardized format

### 4. Accounts

- **Account Management**:
  - Add, edit, delete bank accounts
  - Track multiple accounts
  - Account types (checking, savings, credit card, etc.)
  - Real-time balance calculations
  - Account numbers (can be hidden via preferences)
- **Transfers**:
  - Transfer funds between accounts
  - Automatic balance updates
  - Transfer history tracking

### 5. Budgets

- **Budget Creation**:
  - Set budgets by category
  - Define budget period (monthly, quarterly, yearly)
  - Set start and end dates
  - Budget amount
- **Budget Tracking**:
  - Real-time spent amount tracking
  - Remaining budget calculation
  - Progress visualization
  - Budget alerts (when approaching limits)
- **Bulk Operations**:
  - Edit multiple budgets simultaneously
  - Delete multiple budgets

### 6. Goals

- **Goal Management**:
  - Create financial goals with target amounts
  - Set target dates
  - Assign categories and priorities
  - Track progress
- **Goal Contributions**:
  - Add contributions toward goals
  - View contribution history
  - Progress percentage calculation
- **Bulk Operations**:
  - Edit multiple goals
  - Delete multiple goals

### 7. Preferences (User Settings)

- **Appearance**:
  - Theme selection: Light, Dark, System
  - Currency: USD, EUR, GBP, CAD, AUD
  - Language: English, Español, Français, Deutsch, Italiano
- **Notifications**:
  - Email notifications
  - Budget alerts
  - Goal reminders
  - Weekly reports
- **Display Options**:
  - Show/hide account numbers
  - Compact view mode
  - Show/hide cents in currency display
- **Settings Persistence**: Preferences saved to database and synced across sessions

### 8. Reports

- **Financial Reports**:
  - Income vs expenses over time
  - Spending by category
  - Account balances over time
  - Export functionality (PDF, CSV)

### 9. User Guides & Help

- **Interactive Guides**:
  - Getting started guide
  - Feature-specific tutorials
  - Tips and best practices
- **Help & Support**:
  - FAQ section
  - Contact support

## Technical Specifications

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: Controlled components with React hooks
- **Theme**: next-themes for dark mode support

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (future consideration)
- **Storage**: Supabase Storage (for receipts/avatars - future)

### AI Features

- **Voice Input**: Gemini API (speech recognition + NLP)
- **Receipt Scanning**: Gemini Vision API (OCR + data extraction)

### Data Model

#### Tables

1. **users** (managed by Supabase Auth + custom fields)

   - id, first_name, last_name, initials, avatar, email

2. **accounts**

   - id, user_id, name, balance, type, account_number, is_active

3. **transactions**

   - id, user_id, account_id, date, description, amount, category, type
   - from_party, to_party, destination_account_id (for transfers)
   - status (pending, completed, cancelled, failed)

4. **budgets**

   - id, user_id, category, budget_amount, spent_amount, period
   - start_date, end_date

5. **goals**

   - id, user_id, name, target_amount, current_amount
   - target_date, category, priority, status

6. **user_preferences**
   - id, user_id, theme, currency, language
   - email_notifications, budget_alerts, goal_reminders, weekly_reports
   - show_account_numbers, compact_view, show_cents

### Security

- **Row Level Security (RLS)**: All tables have RLS policies
- **Authentication Required**: Most features require authentication
- **Guest Mode**: Read-only access, no data modification
- **HTTPS**: SSL/TLS encryption in production
- **Environment Variables**: Sensitive data stored in .env files

### Performance

- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Loading states for async operations
- **Optimistic Updates**: Immediate UI feedback with TanStack Query
- **Caching**: React Query caching with configurable stale times
- **Debouncing**: Search and filter operations debounced

## User Experience

### Navigation

- **Top Navigation**: Logo, theme toggle, user menu
- **Dashboard Tabs**: Quick access to main sections (Dashboard, Transactions, Budgets, Goals)
- **Breadcrumbs**: Current location indicator
- **Responsive**: Mobile-friendly navigation

### Loading States

- **Skeleton Screens**: Loading placeholders for better UX
- **Spinners**: For button actions
- **Progressive Loading**: Render what's available first

### Error Handling

- **Toast Notifications**: Success/error messages via Sonner
- **Error Boundaries**: Graceful error recovery
- **Validation**: Client-side form validation
- **Network Errors**: Retry mechanisms

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **Focus Management**: Proper focus states
- **Color Contrast**: WCAG compliant

## Future Considerations

- Recurring transactions
- Transaction search with filters
- Multi-currency support with conversion
- Budget recommendations (AI-powered)
- Investment portfolio tracking
- Bank account integration (Plaid)
- Mobile apps (React Native)
- Offline support with sync
- Collaborative budgets (family/household)

## Out of Scope (Current Version)

- Social features (sharing, comparing)
- Bill payment integration
- Tax preparation features
- Investment analysis tools
- Cryptocurrency tracking
- International wire transfers

## Success Metrics

- User signup rate
- Daily active users
- Transaction entry rate
- Budget adherence (% of users staying within budget)
- Goal completion rate
- Feature adoption (voice input, receipt scanning)
- Session duration
- User retention (30-day, 90-day)

## Version

- **Current Version**: 0.1.0 (MVP)
- **Last Updated**: October 25, 2025
