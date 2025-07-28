import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

function App() {
  
  console.log('App cargado');
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
