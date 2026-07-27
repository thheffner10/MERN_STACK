import React from "react";


function TodoCard({

todo,

onToggle,

onEdit,

onDelete

})
{

return (

<div
className={
todo.completed
?
"todo-card completed"
:
"todo-card"
}
>


<h3>

{todo.title}

</h3>


<p>

{todo.description}

</p>


<div>

Priority:

<strong>

{todo.priority}

</strong>

</div>



<div className="card-actions">


<button

onClick={() =>
onToggle(todo.id)}

>

{

todo.completed

?

"Undo"

:

"Complete"

}

</button>



<button

onClick={() =>
onEdit(todo)}

>

Edit

</button>



<button

onClick={() =>
onDelete(todo.id)}

>

Delete

</button>


</div>


</div>

);

}


export default TodoCard;