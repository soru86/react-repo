# 🎮 Game Score Board

A fully functional React application for tracking game scores and managing player leaderboards.

## Features

- ✅ **Player Management**: Add and remove players easily
- ✅ **Score Tracking**: Update scores with quick increment/decrement buttons (+1, +5, -1, -5)
- ✅ **Live Leaderboard**: Automatically sorted leaderboard with visual rankings
- ✅ **Game History**: Timeline of all game activities and score changes
- ✅ **Local Storage**: Persistent data storage using browser's localStorage
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage

1. **Add Players**: Enter a player name and click "Add Player"
2. **Update Scores**: Use the +/- buttons on each player card to adjust scores
3. **View Leaderboard**: See players ranked by score in real-time
4. **Check History**: View all game activities in the history timeline
5. **Reset Options**: 
   - Reset Scores: Set all player scores to 0
   - Reset Game: Remove all players and clear history

## Project Structure

```
src/
├── components/          # React components
│   ├── GameControls.js  # Player addition and game controls
│   ├── PlayerList.js    # List of players with score controls
│   ├── ScoreBoard.js    # Leaderboard display
│   └── GameHistory.js   # Activity timeline
├── hooks/               # Custom React hooks
│   └── useLocalStorage.js  # Local storage persistence hook
├── App.js               # Main application component
└── index.js             # Application entry point
```

## Technologies Used

- React 18.2.0
- CSS3 (with modern features like Grid, Flexbox, Gradients)
- LocalStorage API for data persistence

## Features in Detail

### Player Management
- Add unlimited players
- Remove players with confirmation
- Player names are validated and trimmed

### Score System
- Quick increment/decrement buttons
- Real-time score updates
- Visual feedback on score changes

### Leaderboard
- Automatic sorting by score
- Top 3 players highlighted with special styling
- Visual score bars showing relative performance
- Medal icons for top performers

### Game History
- Tracks all player actions
- Shows timestamps in relative format
- Scrollable timeline
- Limited to last 50 entries for performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.

