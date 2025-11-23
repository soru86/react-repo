# Storybook Component Library

A modern React component library built with TypeScript, Vite, and Storybook.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

Run Storybook to view and develop components:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

### Build

Build Storybook for production:

```bash
npm run build-storybook
```

Build the component library:

```bash
npm run build
```

## 📦 Components

### Button

A versatile button component with multiple variants, sizes, and states.

**Variants:**
- `primary` - Primary action button (default)
- `secondary` - Secondary action button
- `success` - Success/positive action button
- `danger` - Destructive action button
- `warning` - Warning/caution button
- `info` - Informational button

**Sizes:**
- `small` - Compact button
- `medium` - Standard button (default)
- `large` - Prominent button

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `fullWidth` - Make button full width
- `isLoading` - Show loading spinner
- `disabled` - Disable the button
- `children` - Button content

## 🎨 Storybook Addons

This project includes the following Storybook addons for a rich development experience:

- **@storybook/addon-essentials** - Essential addons (Actions, Controls, Docs, Viewport, etc.)
- **@storybook/addon-interactions** - Test user interactions
- **@storybook/addon-links** - Link stories together
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-backgrounds** - Change background colors
- **@storybook/addon-viewport** - Test responsive designs
- **@storybook/addon-storysource** - View story source code
- **@storybook/addon-measure** - Measure elements
- **@storybook/addon-outline** - Visualize element outlines

## 🛠️ Tech Stack

- **React** 18.3.1 - UI library
- **TypeScript** 5.6.3 - Type safety
- **Vite** 6.0.1 - Build tool
- **Storybook** 8.3.1 - Component development environment

## 📝 License

MIT

