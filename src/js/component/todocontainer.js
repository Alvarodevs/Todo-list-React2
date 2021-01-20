import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "../../styles/todocontainer.scss";
import "bootstrap";
import PropTypes from "prop-types";

export let ToDoContainer = () => {
	//UseState de tareas y el cambio de tareas
	let [task, setTask] = useState("");
	//UseState del array de tareas que necesitamos para visualizar y contar.
	let [arrayTasks, setArrayTasks] = useState([]);

	//FETCH --> GET --> Get devuelve a (data) los datos que descarga de API con este usuario y los manda a setArrayTasks
	// setArrayTasks actualiza (useState) el array de tareas.
	useEffect(function() {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon")
			.then(response => response.json()) // convert to json
			.then(data => {
				setArrayTasks(data);
			})
			.catch(err => console.log("Request Failed", err)); // Catch errors
	}, []);

	//Funcion creacion de array con "task", e Input a "blank".
	const handleKeyPress = event => {
		event.preventDefault();
		var taskElement = { label: task, done: false };
		setArrayTasks([taskElement, ...arrayTasks]);
		modifyList([taskElement, ...arrayTasks]);
		setTask("");
	};
	var resultArray = [];
	//ELIMINACION DE ELEMENTOS
	const removeElement = index => {
		resultArray = arrayTasks;
		resultArray.splice(index, 1);
		setArrayTasks([...resultArray]);
		modifyList([...resultArray]);
	};

	//Elimina todos los elementos visibles
	const removeAllElements = index => {
		setArrayTasks([]);
		modifyList([]);
	};

	//map para recorrer el array
	const listOfTasks = arrayTasks.map((element, index) => {
		return (
			<li key={index}>
				{element.label}
				<div
					className="icondelete"
					onClick={() => removeElement(index)}>
					<i className="fas fa-times" />
				</div>
			</li>
		);
	});

	//DELETE para toda la lista & POST posterior para creacion
	// const deleteMethod = () => {
	// 	//console.log(value, "Hello!!");
	// 	fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon", {
	// 		method: "DELETE"
	// 	})
	// 		.then(response => response.json())
	// 		.then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
	// 		.catch(err => console.log(err)); // Do something with the error
	// };

	//POST
	const createNewPost = () => {
		//console.log(value, "Hello!!");
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon", {
			method: "POST",
			body: JSON.stringify(),
			headers: { "Content-type": "application/json" }
		})
			.then(response => response.json())
			.then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
			.catch(err => console.log(err)); // Do something with the error
	};

	const modifyList = e => {
		//console.log(element, "Hello!!");
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon", {
			method: "PUT",
			body: JSON.stringify(e),
			headers: { "Content-type": "application/json" }
		})
			.then(response => response.json()) // convert to json
			.then(() => {
				if (arrayTasks.length > 0) {
					fetch(
						"https://assets.breatheco.de/apis/fake/todos/user/agarzon",
						{
							method: "DELETE"
						}
					)
						.then(response => response.json())
						.catch(err => console.log(err)); // Do something with the error
				}
			})
			.catch(err => {
				console.log("Request Failed", err);
			}); // Catch errors
	};

	return (
		<div className="form-container">
			<Form onSubmit={event => handleKeyPress(event)}>
				<Form.Group controlId="formTask">
					<Form.Control
						type="text"
						placeholder="Write your next task here"
						value={task}
						onChange={e => setTask(e.target.value)}
					/>
				</Form.Group>
			</Form>

			<ul className="table"> {listOfTasks} </ul>
			<div className="d-flex flex-row justify-content-between">
				<p className="task-counter"> {arrayTasks.length} items left </p>
				<div className="removeall d-flex mr-4">
					<p className="textremove"> Remove all </p>
					<div
						className="icondelete mt-1 ml-2"
						onClick={() => removeAllElements()}>
						<i className="fas fa-times" />
					</div>
				</div>
			</div>
		</div>
	);
};
