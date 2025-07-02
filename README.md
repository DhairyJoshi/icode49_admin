# Portfolio Admin Dashboard

A modern, responsive admin dashboard for managing portfolio content including blogs and projects. Built with React, Tailwind CSS, and Heroicons.

## Features

### 🎯 Dashboard Overview
- **Statistics Cards**: View total blogs, projects, views, and growth metrics
- **Recent Activity**: Timeline of recent blog and project activities
- **Quick Actions**: Direct access to create new blogs and projects

### 📝 Blog Management
- **Create**: Add new blog posts with title, content, excerpt, author, tags, and status
- **Read**: View all blogs in a clean table format with key information
- **Update**: Edit existing blog posts with full form validation
- **Delete**: Remove blogs with confirmation dialog
- **Status Management**: Toggle between draft and published states
- **Tag System**: Add multiple tags for better categorization

### 🚀 Project Management
- **Create**: Add new projects with comprehensive details
- **Read**: View projects with technology tags, status, and links
- **Update**: Edit project information including URLs and featured status
- **Delete**: Remove projects with confirmation
- **Status Tracking**: Track project progress (planned, in-progress, completed)
- **Featured Projects**: Mark important projects as featured
- **External Links**: Add GitHub and live demo URLs
- **Technology Stack**: Tag projects with relevant technologies

### 🎨 Design Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Dark/Light Mode Ready**: Built with accessibility in mind
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Modal Forms**: Clean, focused forms for data entry
- **Data Persistence**: Uses localStorage for data storage

## Technology Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd icode49_admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

### Dashboard
- Navigate to the Dashboard tab to see overview statistics
- View recent activity and quick action buttons

### Managing Blogs
1. Click on "Blogs" in the sidebar
2. Click "New Blog" to create a new blog post
3. Fill in the required fields (title, content, author)
4. Add optional fields like excerpt, tags, and status
5. Click "Create Blog" to save
6. Use the edit/delete buttons in the table to manage existing blogs

### Managing Projects
1. Click on "Projects" in the sidebar
2. Click "New Project" to create a new project
3. Fill in project details including technologies and URLs
4. Set project status and featured status
5. Click "Create Project" to save
6. Use the action buttons to edit, delete, or view project links

## Data Storage

The application currently uses browser localStorage for data persistence. This means:
- Data is stored locally in your browser
- Data persists between sessions
- No server setup required for development

For production use, consider integrating with a backend API or database.

## Customization

### Styling
- Modify Tailwind classes in the component files
- Update color schemes by changing the color classes
- Add custom CSS in `src/index.css`

### Features
- Add new fields to blog/project forms
- Implement additional status types
- Add image upload functionality
- Integrate with external APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository or contact the development team.
