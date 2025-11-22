# Chrome-like Browser

A modern browser application built with React.js and Electron.js, designed to mimic the look and feel of Google Chrome.

## Features

- **Tab Management**: Create, close, and switch between multiple tabs
- **Address Bar**: Navigate to URLs or search the web
- **Bookmarks**: Save and manage your favorite websites
- **History**: Track your browsing history
- **Modern UI**: Chrome-like interface with smooth animations
- **Desktop Application**: Built with Electron for cross-platform support

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (Recommended)

**Option 1: Run both in separate terminals**

1. Start the React development server:
```bash
npm start
```

2. In a new terminal, run Electron:
```bash
npm run electron-dev
```

**Option 2: Quick Start (Single Command)**

You can also run both together, but you'll need to start them in separate terminals for the best experience.

### Production Build

1. Build the React app:
```bash
npm run build
```

2. Run the built Electron app:
```bash
npm run electron
```

3. Or package for distribution:
```bash
npm run electron-pack
```

## Project Structure

```
chrome-like-browser/
├── public/
│   ├── electron.js       # Electron main process
│   └── index.html        # HTML template
├── src/
│   ├── components/
│   │   ├── TitleBar.js   # Window controls
│   │   ├── TabBar.js     # Tab management
│   │   ├── AddressBar.js # URL bar and navigation
│   │   ├── WebView.js    # Web content display
│   │   └── NewTabPage.js # New tab page component
│   ├── App.js            # Main application component
│   ├── App.css
│   ├── index.js          # React entry point
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- **React.js**: UI framework
- **Electron.js**: Desktop application framework
- **HTML5 WebView**: For rendering web content

## Browser Features

### Navigation
- Back, Forward, Refresh, and Home buttons
- Address bar with URL autocomplete
- Search integration (Google)

### Tabs
- Multiple tab support
- Tab switching
- Tab closing
- Tab titles and favicons

### Bookmarks
- Add/remove bookmarks
- Bookmark indicator in address bar
- Bookmark suggestions in address bar

### History
- Automatic history tracking
- History suggestions in address bar

## Development Notes

- The application uses Electron's webview tag to render web content
- Window controls are customized for a native feel
- The UI is designed to closely match Chrome's appearance

## License

MIT

