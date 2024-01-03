import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem"; 
import './Container.css';

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {tasks} from '../tasks.js'

export const Container = (props) => {
    const { id, items, allItems, setItems } = props;


    const {setNodeRef} = useDroppable({
        id
    })

    return(
        <SortableContext 
            id={id}
            items={items}
            strategy={verticalListSortingStrategy}>
                <div  className="column" ref={setNodeRef}>
                    <h3 className="title">{props.title}</h3>
                    {items.length > 0 ? 
                        items.map(item => {
                            return (
                                <SortableItem key={item.id} id={item.id} items={allItems} setItems={setItems}>{item.title}</SortableItem>
                            )}
                        ) : null
                    }
                </div>
        </SortableContext>
    )
}