# 🎯 POAP Mint Builder

A powerful, customizable POAP (Proof of Attendance Protocol) mint page builder that allows you to create beautiful, branded mint experiences for your events.

## 🚀 Live Demo

**[Try the Live Demo →](https://poap-mint-builder-2233blkc9-adminpoapfrs-projects.vercel.app)**

## ✨ Features

### 🎨 **Visual Customization**
- **Color Picker Suite**: Customize background, title, CTA buttons, and text colors
- **Typography Control**: Choose from multiple font families and sizes
- **Brand Assets**: Upload custom logos and POAP images
- **Real-time Preview**: See changes instantly across all pages

### 📱 **Mobile-First Design**
- **iPhone Frame Preview**: See exactly how your mint page looks on mobile
- **Responsive Layout**: Optimized for all device sizes
- **Touch-Friendly Interface**: Designed for mobile interaction

### 🔧 **Page Builder**
- **Form Page**: Customizable claim form with wallet/email options
- **Loading Page**: Branded loading experience with animations
- **Success Page**: Celebration page with ownership details
- **Content Management**: Organized by page sections for easy editing

### ⚙️ **Advanced Configuration**
- **Claim Methods**: Support for wallet-only, email-only, or both
- **Custom Fields**: Add additional form fields as needed
- **Consent Management**: Optional privacy consent checkbox
- **Slider Backgrounds**: Customizable overlay colors and text

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with Glass-morphism effects
- **State Management**: React Hooks
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/poap-studio/poap-mint-builder.git

# Navigate to project directory
cd poap-mint-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📖 Usage Guide

### 1. **Assets Configuration**
- Upload your event logo (recommended: 150x35px)
- Add your POAP image (recommended: 400x400px circular)

### 2. **Design & Styling**
- Use color pickers to match your brand colors
- Select appropriate fonts for your audience
- Adjust button and text sizes for readability

### 3. **Content Customization**
- **Form Page**: Set POAP title, description, and claim button text
- **Loading Page**: Customize congratulations message and loading text
- **Success Page**: Configure success messages and CTA button

### 4. **Form Settings**
- Choose claim method (wallet, email, or both)
- Add custom fields if needed
- Configure consent requirements

### 5. **Preview & Test**
- Switch between Form, Loading, and Success page previews
- Test on different screen sizes
- Verify all customizations appear correctly

## 🎯 Use Cases

- **Conference POAPs**: Create mint pages for tech conferences and meetups
- **Workshop Certificates**: Issue completion certificates for online courses
- **Community Events**: Reward attendance at community gatherings
- **Brand Activations**: Create memorable experiences for marketing events
- **Gaming Achievements**: Issue achievement tokens for game milestones

## 🔧 Customization Examples

### Corporate Event
```javascript
// Professional blue theme
backgroundColor: '#1e40af'
primaryColor: '#ffffff'
ctaColor: '#3b82f6'
fontFamily: 'Inter'
```

### Creative Workshop
```javascript
// Vibrant creative theme
backgroundColor: '#7c3aed'
primaryColor: '#fbbf24'
ctaColor: '#f59e0b'
fontFamily: 'Georgia'
```

### Gaming Tournament
```javascript
// Dark gaming theme
backgroundColor: '#111827'
primaryColor: '#10b981'
ctaColor: '#ef4444'
fontFamily: 'Arial'
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Deploy automatically

### Deploy to Netlify

1. Fork this repository
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Use GitHub Actions for automated deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 About POAP

POAP (Proof of Attendance Protocol) is a protocol that creates digital badges (NFTs) to commemorate special moments and experiences. Each POAP is a unique NFT that proves you were part of a specific event.

Learn more at [poap.xyz](https://poap.xyz)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/poap-studio/poap-mint-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/poap-studio/poap-mint-builder/discussions)
- **POAP Community**: [Discord](https://discord.gg/poap)

## 🙏 Acknowledgments

- POAP team for the amazing protocol
- React community for the robust framework
- Vercel for seamless deployment
- Open source contributors

---

**Built with ❤️ for the POAP community**

⭐ **Star this repo if you find it useful!**