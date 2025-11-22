# Star Wars Characters App

A React application that displays Star Wars characters using the SWAPI (Star Wars API). Built with React, react-virtualized for efficient rendering, and comprehensive test coverage.

## Features

- ✅ Display list of Star Wars characters from SWAPI
- ✅ Search/filter functionality
- ✅ Sorting by multiple fields (name, gender, birth year, height, mass)
- ✅ Virtualized list rendering for performance (react-virtualized)
- ✅ Data caching (5-minute cache duration)
- ✅ Responsive design
- ✅ 100% test coverage with Jest + React Testing Library

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

3. Run tests with coverage:
```bash
npm test
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── CharacterList/      # Virtualized character list component
│   ├── SearchBar/          # Search input component
│   ├── LoadingSpinner/     # Loading indicator
│   └── ErrorMessage/       # Error display component
├── services/
│   └── api.js              # API service with caching
├── utils/
│   ├── sortCharacters.js   # Sorting utility
│   └── filterCharacters.js # Filtering utility
├── App.js                  # Main app component
└── __tests__/             # Test files
```

## Testing

The project includes comprehensive test coverage:

- Unit tests for utilities (sorting, filtering)
- Unit tests for API service (including cache)
- Component tests with React Testing Library
- Integration tests for the main App component

Run tests:
```bash
npm test
```

View coverage report:
```bash
npm test -- --coverage
```

## Technologies Used

- React 18
- react-virtualized
- Jest
- React Testing Library
- SWAPI (Star Wars API)

## API

This app uses the [SWAPI](https://swapi.dev/) API to fetch Star Wars character data.

## License

MIT

