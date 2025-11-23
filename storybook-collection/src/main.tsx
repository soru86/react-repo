import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div>
            <h1>Component Library</h1>
            <p>Run <code>npm run storybook</code> to view components in Storybook</p>
        </div>
    </StrictMode>,
)

