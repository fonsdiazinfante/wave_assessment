import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

export default function App() {

  const [numberReports, setNumberReports] = useState()
  const [getNumbers, setGetNumbers] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/report/getReportNumbers')
    .then(function(response) {
                return response.json();
            }).then(function(data) {
            setNumberReports(data);
            setGetNumbers(false)  
            });
  }, [getNumbers])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home numberReports={numberReports} getNumbers={setGetNumbers} />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);