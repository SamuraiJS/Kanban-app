import React, {useState, useRef} from 'react';
import './ColumnsTask.css';

import { 
  DndContext, 
  DragOverlay,  
  PointerSensor, 
  KeyboardSensor, 
  useSensor, 
  useSensors } from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates, 
  arrayMove,
   } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Container } from './Container';
import { tasks } from '../tasks.js';

const ColumnsTasks = (props) => {
  const textRef = useRef('');
  const idRef =  useRef(3);

  /*
  const [items, setItems] = useState({
    TD: tasks,
    DG: [],
    DS: [],
  });
  */
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );


  const handleDragEnd = (event) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over ? over : {id : 0};

    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId);

    let activeItem = findItem(id, props.items[activeContainer])
    let overItem = findItem(overId, props.items[overContainer])

    let activeIndex = props.items[activeContainer].indexOf(activeItem);
    let overIndex =props. items[overContainer].indexOf(overItem);

    if(!activeContainer || !overContainer) {
      return;
    } 

    if(activeIndex !== overIndex) {
      props.setItems(items => ({
        ...props.items,
        [overContainer] : arrayMove(items[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveId(null);
  }

  const handleDragOver = (event) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over ? over : {id : 0};

    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId);


    if(!activeContainer || !overContainer || overContainer === activeContainer) {
      return;
    }
    
    props.setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      let activeItem = findItem(id, activeItems)
      let overItem = findItem(overId, overItems)

      let overIndex = overItems.indexOf(overItem);

      let newIndex;
      if(overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
      }

      return {
        ...prev, 
        [activeContainer] : [
          ...prev[activeContainer].filter(item => item.id !== id)
        ],
        [overContainer] : [
          ...prev[overContainer].slice(0, newIndex),
          activeItem,
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ]
      }
    })
  }

  const handleDragStart = (event) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const findContainer = (id) => {
    if(id in props.items) {
      return id;
    }

    //Filtrar por aquella calve o propiedad en la que esta contenido el valor "id"
    return Object.keys(props.items).find(key => props.items[key].find(i => {return i.id === id}));
    
  }

  const findItem = (id, array) => {
    return array.find(ele => ele.id === id);
  }

  const handleNewTask = (text) => {
    textRef.current = text.target.value;
  }

  const handleSubmiteNewTask = () => {
    idRef.current = idRef.current + 1;

    let task = {
      id : idRef.current,
      title : textRef.current,
    }

    const newTD = [...props.items.TD, task];
    
    props.setItems((prev) => {
      return {
        ...prev,
        ['TD'] : newTD,
      }
    });
  }

  //Agregar los títulos a cada tabla
  //Agregar un imput para agrgar más tareas

  return (
    <>
      <div className='app'>
        <div className='columns'>
          <DndContext 
            sensors={sensors}
            onDragEnd={handleDragEnd} 
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            >
            <Container className="container td" id='TD' items={props.items.TD} allItems={props.items} setItems={props.setItems} title='To-Do'/>
            <Container className="container dg" id='DG' items={props.items.DG} allItems={props.items} setItems={props.setItems} title='Doing'/>
            <Container className="container ds" id='DS' items={props.items.DS} allItems={props.items} setItems={props.setItems} title='Does'/>
            <DragOverlay>{activeId ? <SortableItem id={activeId}/> : null}</DragOverlay>
          </DndContext>
        </div>
        <form className='new-task' action='#'>
          <label htmlFor='task'>Escribe una nueva tarea:</label>
          <input onChange={handleNewTask} id='task' type='text' placeholder='Escribir nueva tarea....'/>
          <button className="submit" onClick={handleSubmiteNewTask}>Agregar</button>
        </form>
      </div>
    </>
  )
}

export default ColumnsTasks;