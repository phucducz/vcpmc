import './App.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { publicRoutes } from './routes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            let { path, Component } = route;

            return <Route key={index} path={path} element={<Component />} />
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
