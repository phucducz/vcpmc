import './App.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts/DefaultLayout';
import { LanguageProvider } from './context/Language/LanguageProvider';

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
