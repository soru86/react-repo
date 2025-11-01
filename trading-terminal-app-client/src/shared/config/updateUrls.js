// Utility script to update URLs in the configuration
// Run this script to update your ngrok URL or other environment URLs

const updateNgrokURL = (newUrl) => {
  console.log('Updating ngrok URL to:', newUrl);

  // You would need to modify the api.js file directly
  // This is a helper function to guide the update process

  console.log('Please update the following files:');
  console.log('1. dash/src/config/api.js - Update the ngrok URL');
  console.log('2. dash/src/components/URLSwitcher.jsx - Update the ngrok URL');

  console.log('\nIn api.js, change:');
  console.log('ngrok: "https://454458bfc3bc.ngrok-free.app"');
  console.log('to:');
  console.log(`ngrok: "${newUrl}"`);

  console.log('\nIn URLSwitcher.jsx, change:');
  console.log('url: "https://454458bfc3bc.ngrok-free.app"');
  console.log('to:');
  console.log(`url: "${newUrl}"`);
};

// Example usage:
// updateNgrokURL('https://your-new-ngrok-url.ngrok-free.app');

export { updateNgrokURL }; 