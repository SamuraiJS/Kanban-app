import { useState } from 'react'
import './App.css';
import ColumnsTasks from './components/ColumnsTasks.jsx';

import { tasks } from './tasks.js'

function App() {

  const [items, setItems] = useState({
    TD: tasks,
    DG: [],
    DS: [],
  });

  return (
    <>
      <h1>Kanban app</h1>
      <div className='container-app'>
        <ColumnsTasks items={items} setItems={setItems}/>
      </div>
    </>
  )
}

export default App
