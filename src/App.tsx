import './App.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts/DefaultLayout';

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
                  <Layout>
                    <Page />
                  </Layout>
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
