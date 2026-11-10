import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

/*getMe(
  "token"
)
  .then((Me) => console.log(Me))
  .catch((err: unknown) => {
    if (err instanceof ApiError) {
      console.log(err.status, err.detail, err.fields);   // 404 "Not found." {}
    } else {
      console.log("not an API error:", err);
    }
  });
*/
