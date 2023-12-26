import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (localStorage.getItem('todos')) {
      const storedTodos = JSON.parse(localStorage.getItem('todos'));
      console.log(storedTodos);
      setTodos(storedTodos);
    }
  }, []);

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo = { id: Date.now(), text: inputText, completed: false };
      setTodos([...todos, newTodo]);
      localStorage.setItem('todos', JSON.stringify([...todos, newTodo]));
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    localStorage.setItem('todos', JSON.stringify(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    localStorage.setItem('todos', JSON.stringify(todos.filter((todo) => todo.id !== id)));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    console.log(result);
    const newTodos = Array.from(todos);
    const [movedTodo] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedTodo);

    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: "center" }}>
        <h1>Todo List</h1>
        <div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a new todo"
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>
        <ul>
          <Droppable droppableId="todos">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                        />
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                          {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ul>
      </div>
    </DragDropContext>
  );
}

export default App;
