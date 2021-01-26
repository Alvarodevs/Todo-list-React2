import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "../../styles/todocontainer.scss";
import "bootstrap";

export let ToDoContainer = () => {
	//UseState de tareas y el cambio de tareas
	let [task, setTask] = useState("");
	//UseState del array de tareas que necesitamos para visualizar y contar.
	let [arrayTasks, setArrayTasks] = useState([]);
	//FETCH --> GET --> Get devuelve a (data) los datos que descarga de API con este usuario y los manda a setArrayTasks
	// setArrayTasks actualiza (useState) el array de tareas.
	useEffect(function() {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon")
			.then(response => response.json())
			.then(data => {
				setArrayTasks(data);
			})
			.catch(err => console.log("Request Failed", err)); //aquí también podria venir la generación de la lista.
	}, []);
	console.log(arrayTasks);
	//Funcion creacion de array con "task"
	const handleKeyPress = event => {
		event.preventDefault();
		arrayTasks = arrayTasks.concat({ label: task, done: false });
		setArrayTasks(arrayTasks);
		modifyList(arrayTasks);
		setTask("");
	};
	var resultArray = [];
	//elimina un elemento concreto
	const removeElement = index => {
		resultArray = arrayTasks;
		if (resultArray.length > 0) {
			resultArray.splice(index, 1);
			setArrayTasks([...resultArray]);
			modifyList([...resultArray]);
		}
		if (resultArray.length === 0) {
			resultArray.splice(index, 1);
			deleteList();
		}
	};
	//Elimina todos los elementos visibles
	const removeAllElements = index => {
		setArrayTasks([]);
		deleteList([]);
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
	//API añadir lista.
	const modifyList = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon", {
			method: "PUT",
			body: JSON.stringify(arrayTasks),
			headers: { "Content-type": "application/json" }
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
			.catch(err => {
				console.log("Request Failed", err);
			});
	};
	//API eliminar lista.
	const deleteList = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/agarzon", {
			method: "DELETE",
			body: JSON.stringify([""]),
			headers: { "Content-type": "application/json" }
		})
			.then(response => response.json())
			.then(data => {
				fetch(
					"https://assets.breatheco.de/apis/fake/todos/user/agarzon",
					{
						method: "POST",
						body: JSON.stringify([""]),
						headers: { "Content-type": "application/json" }
					}
				)
					.then(response => response.json())
					.then(data =>
						fetch(
							"https://assets.breatheco.de/apis/fake/todos/user/agarzon"
						)
							.then(response => response.json())
							.then(data => {
								setArrayTasks(data);
							})
							.catch(err => console.log("Request Failed", err))
					)

					.catch(err => {
						console.log("Request Failed", err);
					});
			})
			.catch(err => {
				console.log("Request Failed", err);
			});
	};

	//formulario
	//incluye un onChange
	//Genera la lista de tareas que viene dada del map de arrayTasks
	//Cuenta el length del array

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
