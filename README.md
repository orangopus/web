# 🚀 Orangopus - Community-Driven Development Platform

A modern, beautiful Vue.js website showcasing the Orangopus community with GitHub integration, social features, and project collaboration tools.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/orangopus/web.git)

## 📍 Repository
**GitHub**: https://github.com/orangopus/web.git

## ✨ Features

### 🌟 Core Features
- **Modern Design**: Beautiful cosmic-themed UI with animations and particle effects
- **Responsive Layout**: Fully responsive design that works on all devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **Performance Optimized**: Fast loading and smooth interactions

### 🔗 GitHub Integration
- **Repository Showcase**: Display your GitHub repositories with stats
- **Connect GitHub**: OAuth-style connection to your GitHub account
- **Repository Sharing**: Share repositories directly to the community feed
- **User Stats**: View your GitHub statistics (stars, forks, followers)
- **Repository Filtering**: Filter by public/private repositories

### 👥 Social Feed
- **Community Posts**: Share updates, questions, and project progress
- **Project Showcase**: Create and share your projects with the community
- **Like & Share**: Interact with community posts
- **GitHub Integration**: Link posts to GitHub repositories
- **Real-time Updates**: Dynamic feed with loading states

### 📱 Project Management
- **Project Creation**: Create and showcase your projects
- **Category Filtering**: Filter projects by category (Web, Mobile, AI/ML, Games, etc.)
- **GitHub Linking**: Link projects to GitHub repositories
- **Live Demo URLs**: Share live demos of your projects
- **Project Analytics**: Track likes and engagement

### 🎨 UI/UX Features
- **Glass Morphism**: Modern glass-like effects throughout the interface
- **Particle Backgrounds**: Animated particle systems for visual appeal
- **Gradient Text**: Beautiful gradient text effects
- **Hover Animations**: Smooth hover effects on interactive elements
- **Loading States**: Elegant loading spinners and states
- **Notification System**: Toast notifications for user feedback

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with TypeScript
- **Styling**: CSS3 with modern features (Grid, Flexbox, Custom Properties)
- **Animations**: CSS animations and Intersection Observer API
- **Build Tool**: Vue CLI
- **Deployment**: GitHub Pages ready

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/orangopus/web.git
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Create the following tables in your Supabase database:

   **Posts Table:**
   ```sql
   CREATE TABLE posts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_name TEXT NOT NULL,
     user_avatar TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     likes INTEGER DEFAULT 0,
     tags TEXT[] DEFAULT '{}',
     github_repo JSONB
   );
   ```

   **Projects Table:**
   ```sql
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     image_url TEXT NOT NULL,
     github_url TEXT,
     live_url TEXT,
     technologies TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     author_name TEXT NOT NULL,
     author_avatar TEXT NOT NULL
   );
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VUE_APP_SUPABASE_URL=https://your-project.supabase.co
   VUE_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/           # Vue components
│   ├── Header.vue       # Main navigation header
│   ├── Navigation.vue   # Fixed navigation bar
│   ├── SocialFeed.vue   # Community social feed
│   ├── GitHubIntegration.vue # GitHub integration
│   ├── ProjectShowcase.vue   # Project showcase
│   ├── TeamSection.vue  # Team member showcase
│   ├── FAQSection.vue   # FAQ section
│   ├── CTASection.vue   # Call-to-action section
│   ├── Footer.vue       # Footer component
│   └── Notification.vue # Toast notification system
├── screens/             # Main app screens
│   └── OrangopusWebapp.vue # Main application component
├── icons/               # SVG icon components
└── main.ts             # Application entry point
```

## 🎯 Key Components

### SocialFeed.vue
- Community post creation and display
- GitHub repository integration
- Like and share functionality
- Real-time feed updates

### GitHubIntegration.vue
- GitHub account connection
- Repository showcase with stats
- Repository sharing to social feed
- User statistics display

### ProjectShowcase.vue
- Project creation form
- Category-based filtering
- GitHub and live demo linking
- Project analytics

### Navigation.vue
- Fixed navigation bar
- Smooth scrolling to sections
- Theme toggle functionality
- Active section highlighting

## 🎨 Customization

### Colors and Themes
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #ff5500;
  --secondary-color: #ff7a00;
  --background-color: #000000;
  --text-color: #ffffff;
}
```

### Adding New Sections
1. Create a new Vue component in `src/components/`
2. Add it to the main app in `src/screens/OrangopusWebapp.vue`
3. Add navigation link in `src/components/Navigation.vue`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 Deployment

### GitHub Pages
The project is configured for GitHub Pages deployment:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Cursor or Vercel"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select source branch (usually `main`)
   - Select folder: `/docs` or `/root`

### Other Platforms
The built files in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js** - Progressive JavaScript framework
- **Unsplash** - Beautiful stock photos
- **Manrope Font** - Modern typography
- **Community** - All contributors and supporters

## 📞 Contact

- **Website**: [orangopus.org](https://orangopus.org)
- **GitHub**: [@orangopus](https://github.com/orangopus)
- **Email**: jordan@orangopus.org

---

Made with ❤️ by the Orangopus Community 