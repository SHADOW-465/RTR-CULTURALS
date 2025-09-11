# RID 3233 Culturals JOSH Registration Portal

A comprehensive registration portal dashboard for managing cultural event registrations across different groups with role-based access control.

## Features

- **Role-based Authentication**: Static login credentials for different user roles
- **Admin Dashboard**: View-only access to all registration data and statistics
- **Group Dashboards**: Group-specific access for managing clubs within assigned groups
- **Registration Committee**: Full access to view all data and manage external registrations
- **Real-time Statistics**: Progress tracking and performance metrics
- **Secure Database**: Row Level Security with proper permissions

## User Roles & Permissions

### Admin
- **Access**: View-only access to all data
- **Permissions**: Cannot add, edit, or delete any records
- **Dashboard**: Complete overview of all groups and statistics

### Group Users (Groups 1-5)
- **Access**: Can add and edit clubs within their assigned group only
- **Permissions**: Full CRUD operations for their group's clubs
- **Dashboard**: Group-specific view with their clubs and statistics

### Registration Committee (RegCom)
- **Access**: View all groups + manage external registrations
- **Permissions**: Can add/edit registrations for "Other District" clubs
- **Dashboard**: Complete view with additional external club management

## Static Login Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: admin@rid3233.org

### Group Access
- **Group 1**
  - Username: `group1`
  - Password: `group1pass`
  - Email: group1@rid3233.org

- **Group 2**
  - Username: `group2`
  - Password: `group2pass`
  - Email: group2@rid3233.org

- **Group 3**
  - Username: `group3`
  - Password: `group3pass`
  - Email: group3@rid3233.org

- **Group 4**
  - Username: `group4`
  - Password: `group4pass`
  - Email: group4@rid3233.org

- **Group 5**
  - Username: `group5`
  - Password: `group5pass`
  - Email: group5@rid3233.org

### Registration Committee Access
- **Username**: `regcom`
- **Password**: `regcom123`
- **Email**: regcom@rid3233.org

## Setup Instructions

1. **Database Setup**
   - Run the SQL scripts in order:
     - `scripts/001_create_tables.sql` - Creates the database schema
     - `scripts/002_create_user_trigger.sql` - Sets up user triggers
     - `scripts/003_seed_sample_data.sql` - Adds sample data
     - `scripts/004_insert_static_users.sql` - Creates static user accounts

2. **Environment Variables**
   - Ensure Supabase integration is properly configured
   - All required environment variables are automatically provided

3. **Access the Portal**
   - Navigate to `/auth/login`
   - Use the credentials above based on your role
   - You'll be automatically redirected to the appropriate dashboard

## Security Notes

- **Production Warning**: In a production environment, passwords should be properly hashed
- **Session Management**: Sessions expire after 24 hours
- **Role Enforcement**: Middleware ensures users can only access authorized routes
- **Database Security**: Row Level Security policies enforce data access rules

## Dashboard Features

### Admin Dashboard
- District-wide statistics and progress tracking
- Group performance comparison
- Top performing clubs identification
- Overall completion rates and targets

### Group Dashboards
- Group-specific club management
- Add/edit clubs within assigned group
- Track group progress and statistics
- Manage estimated vs actual registration counts

### Registration Committee Dashboard
- Complete view of all groups
- External club registration management
- District-wide oversight capabilities
- Special permissions for "Other District" entries

## Technical Stack

- **Frontend**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom static authentication system
- **UI**: Tailwind CSS with shadcn/ui components
- **Security**: Row Level Security (RLS) policies

## Support

For technical support or questions about the portal, please contact the system administrator.
