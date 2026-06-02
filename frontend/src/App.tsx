import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Main from "../componets/Main";
import Playground from "../componets/Playgroud";

import "./App.css";



function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
