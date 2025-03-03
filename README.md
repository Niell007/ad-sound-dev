# AD-Sound Platform

A full-featured audio streaming and booking platform built with Next.js and Supabase.

## 🚀 Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables
3. Run the setup script:
   ```powershell
   ./setup-project.ps1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context, Custom Hooks
- **UI/UX**: Responsive design, Dark/Light mode, Accessibility features
- **Development**: ESLint, Prettier, TypeScript

## 📦 Features

- 🎵 Live Audio Streaming
- 💬 Real-time Chat
- 📅 Booking System
- ⭐ Review System
- 👤 User Profiles
- 🔐 Authentication & RBAC
- 📊 Admin Dashboard
- 📱 Responsive Design
- 🌓 Dark/Light Mode
- 📧 Email Notifications

## 🗂️ Project Structure

```
ad-sound/
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and services
├── public/           # Static assets
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── supabase/         # Database migrations and config
```

## 🔧 Configuration

1. Set up Supabase project
2. Configure environment variables
3. Run database migrations
4. Set up email provider
5. Configure storage bucket

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:
- [Project Diagnostic](docs/project-diagnostic.md)
- [Reviews System](docs/reviews-system.md)
- [Supabase Setup](docs/supabase-reviews-setup.md)
- [Storage Integration](docs/supabase-storage-integration.md)

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## 🔐 Security

- RBAC (Role-Based Access Control)
- Protected API routes
- Secure authentication flow
- Environment variable protection
- Input validation and sanitization

## 📈 Performance

- Optimized images and assets
- Code splitting
- Server-side rendering
- Caching strategies
- Real-time optimizations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please check the documentation first. If you need further assistance:
1. Check existing GitHub issues
2. Create a new issue
3. Contact the development team