import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.less';
import * as serviceWorker from './serviceWorker';
import { GoogleOAuthProvider } from '@react-oauth/google';


const container = document.getElementById("root")
createRoot(container).render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</GoogleOAuthProvider>

)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
