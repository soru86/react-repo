import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import AgentForm from './components/AgentForm';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Default test key

function App() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <AgentForm />
    </GoogleReCaptchaProvider>
  );
}

export default App;

