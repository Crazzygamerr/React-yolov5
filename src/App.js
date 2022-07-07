import React, { useEffect, useState } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';

function App() {
	const [file, setFile] = useState(null);
	const [model, setModel] = useState(null);
	const [result, setResult] = useState("");
	
	// async function loadModel() {
	// 	// const model = await tf.loadLayersModel("best_web_model/model.json");
	// 	const model = await tf.loadGraphModel(process.env.PUBLIC_URL + "/best_web_model/model.json");
	// 	setModel(model)
	// }
	
	async function predict() {
		// const image = new Image();
		// image.src = file;
		// image.onload = async () => {
		// 	const tensor = tf.browser.fromPixels(image);
		// 	const tensor2 = tensor.resizeNearestNeighbor([640, 640]).toFloat();
		// 	const prediction = await model.executeAsync(tensor2.expandDims(), ['detection_classes', 'detection_scores']);
		// 	console.log(prediction[0].dataSync());
		// }
		// setResult(result.toString());
		
		// send file to api
		const formData = new FormData();
		formData.append("file", file);
		const response = await fetch("http://localhost:8000/object-to-json", {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});
		
		const result = await response.json();
		setResult(JSON.stringify(result, null, 2));
	}
	
	// useEffect(() => {
	// 	loadModel();
	// }, []);
	
  return (
    <div className="App">
			<input type="file" onChange={(event) => setFile(URL.createObjectURL(event.target.files[0]))} />
			{file &&
				<div>
					<div>
						<h1>{file.name}</h1>
						<img src={file} alt="file" />
					</div>
					<div>
						<button type="button" onClick={predict}>Predict</button>
					</div>
					<div>
						<p>{result}</p>
					</div>
				</div>
			}
    </div>
  );
}

export default App;

