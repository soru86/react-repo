import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import AgentForm from './components/AgentForm';
import './App.css';

function App() {
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <div className="App">
        <AgentForm />
      </div>
    </GoogleReCaptchaProvider>
  );
}

export default App;

