import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import { LanguageProvider } from './context/Language/LanguageProvider';
import { DefaultLayout } from './layouts/DefaultLayout';
import { publicRoutes } from './routes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            const { path, Component: Page, layout } = route;
            let Layout = DefaultLayout;

            if (layout)
              Layout = layout;
            
            return (
              <Route
                key={index}
                path={path}
                element={
                  <LanguageProvider>
                    <Layout>
                      <Page />
                    </Layout>
                  </LanguageProvider>
                }
              />
            )
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
