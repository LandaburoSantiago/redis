
import './App.css';
import { List } from './components/List';
import { Cargar } from './components/Cargar';
import { Eliminar } from './components/Eliminar';

function App() {
  return (
    <div className="App">
      <List/>
      <Cargar/>
      <Eliminar/>
    </div>
  );
}

export default App;
