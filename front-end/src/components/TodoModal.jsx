import React,{
    useState,
    useEffect
}
from "react";


function TodoModal({

    isOpen,

    onClose,

    onSave,

    existingTodo

})
{

const [todo,setTodo]=useState({

title:"",

description:"",

priority:"Medium",

dueDate:""

});


useEffect(()=>{

if(existingTodo)
{

setTodo(existingTodo);

}
else
{

setTodo({

title:"",

description:"",

priority:"Medium",

dueDate:""

});

}

},[existingTodo]);


if(!isOpen)
return null;


function update(e)
{

setTodo({

...todo,

[e.target.name]:

e.target.value

});

}


function submit(e)
{

e.preventDefault();

if(!todo.title) return;

onSave({

...todo,

id:

existingTodo

?

existingTodo.id

:

Date.now(),

completed:

existingTodo

?

existingTodo.completed

:

false

});

onClose();

}


return(

<div className="modal-overlay">

<div className="habit-modal">

<h2>

{

existingTodo

?

"Edit Task"

:

"Create Task"

}

</h2>

<form
onSubmit={submit}
>

<label>

Task

</label>

<input

name="title"

value={todo.title}

onChange={update}

/>

<label>

Description

</label>

<textarea

name="description"

value={todo.description}

onChange={update}

/>

<label>

Priority

</label>

<select

name="priority"

value={todo.priority}

onChange={update}

>

<option>Low</option>

<option>Medium</option>

<option>High</option>

</select>

<label>

Due Date

</label>

<input

type="date"

name="dueDate"

value={todo.dueDate}

onChange={update}

/>

<div className="modal-buttons">

<button
type="button"
onClick={onClose}
>

Cancel

</button>

<button>

Save

</button>

</div>

</form>

</div>

</div>

);

}

export default TodoModal;