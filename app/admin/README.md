# Admin Panel Documentation

This directory contains the admin panel for the AD Sound Studio application. The admin panel provides a set of tools for administrators to manage users, content, and system settings.

## Role-Based Access Control (RBAC)

The application implements a comprehensive role-based access control system with the following roles:

- **Admin**: Full access to all features and settings
- **Manager**: Access to staff management, bookings, services, and analytics
- **Staff**: Limited access to bookings and client information
- **User**: Regular user access to their own profile and bookings

### Role Hierarchy

Roles follow a hierarchical structure where higher roles inherit permissions from lower roles:

```
Admin > Manager > Staff > User
```

### Implementation Details

1. **Database Structure**:
   - The `profiles` table includes a `role` column that stores the user's role
   - Row-Level Security (RLS) policies control access to data based on user roles

2. **Authentication & Authorization**:
   - Authentication is handled by Supabase Auth
   - Authorization is implemented using custom hooks and context providers:
     - `useRBAC` hook: Provides role-checking functions
     - `RBACContext`: Makes RBAC functions available throughout the app
     - `ProtectedRoute` component: Restricts access to routes based on roles

3. **Admin Routes**:
   - All routes under `/admin/*` are protected and require admin role
   - The admin layout includes a role check that redirects non-admin users

## Admin Features

### User Management

- View all users with pagination and filtering
- Update user roles (admin, manager, staff, user)
- Search users by name or email

### Analytics Dashboard

- Overview of key metrics (users, sessions, bookings)
- User demographics and engagement data
- Booking trends and popular services

## Development

### Setting Up Admin Access

To set a user as an admin for testing:

1. Run the SQL script in `scripts/set-admin-user.sql`
2. Replace `'user-id-here'` with the actual user ID
3. Execute the script against your Supabase database

### Adding New Admin Features

When adding new admin features:

1. Ensure the route is protected with the `ProtectedRoute` component
2. Add appropriate role checks using the `useRBACContext` hook
3. Update the admin sidebar if needed
4. Document the feature in this README

## API Routes

Admin API routes are located in `app/api/admin/` and include:

- `users`: Manage user accounts and roles
- Additional API routes for other admin features

All admin API routes include role checks to ensure only authorized users can access them. 