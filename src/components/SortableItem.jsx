import React from "react";
import './SortableItem.css';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

export const SortableItem = (props) => {
    const {
        atributes, 
        listeners, 
        transform, 
        transition, 
        setNodeRef
    } = useSortable({
        id: props.id
    });

    const style = {
        transform : CSS.Transform.toString(transform),
        transition,
    }

    const handleDelete = (event) => {
        const {innerText : textTask} = event.target.parentElement.firstChild;
        const id = Number(event.target.parentElement.firstChild.id);

        const container = findContainer(id);

        props.setItems(prev => {
            return {
                ...prev,
                [container] : prev[container].filter(i => i.id !== id)
            }
        })
    }


    


    const findContainer = (id) => {
    
        //Filtrar por aquella calve o propiedad en la que esta contenido el valor "id"
        return Object.keys(props.items).find(key => props.items[key].find(i => {return i.id === id}));
        
      }

    return (
        <div className="container-item">
            <div 
                id={props.id}
                className='itemSort' 
                ref={setNodeRef} 
                style={style} 
                {...atributes} 
                {...listeners}
            >
                {props.children}
            </div>
            <button className="delete" onClick={handleDelete}>X</button>
        </div>
    )
}