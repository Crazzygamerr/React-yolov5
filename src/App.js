import React, { useEffect, useState } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import './App.css';

function App() {
	const [file, setFile] = useState(null);
	const [result, setResult] = useState("");
	const [resultImage, setResultImage] = useState(null);
  const [crop, setCrop] = useState(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	
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
		formData.append(
			"file",
			file,
			file.name
		);
		const response = await fetch("http://localhost:8000/object-to-json", {
			method: "POST",
			body: formData,
		});
		
		const responseImage = await fetch("http://localhost:8000/object-to-img", {
			method: "POST",
			body: formData,
		});
		
		const result = await response.json();
		setResult(JSON.stringify(result, null, 2));
		
		const resultImage = await responseImage.blob();
		setResultImage(URL.createObjectURL(resultImage));
	}
	
	// useEffect(() => {
	// 	loadModel();
	// }, []);
	
  return (
    <div className="App">
			<input type="file" onChange={(event) => {
				setFile(event.target.files[0])
				setResult("");
				setResultImage(null);
				setCrop(null);
				setCompletedCrop(null);
			}} />
			{file &&
				<div className='App'>
					<ReactCrop
						crop={crop}
						onChange={(_, percentCrop) => setCrop(percentCrop)}
						onComplete={(c) => setCompletedCrop(c)}
					>
						<img
							src={URL.createObjectURL(file)}
							alt="file"
							// width="400"
							// height="400"
						/>
					</ReactCrop>
					<p> Crop: { JSON.stringify(completedCrop) }</p>
					<button type="button" onClick={predict}>Predict</button>
					{resultImage && 
						<div>
							<img
								src={resultImage}
								alt="result"
								width="400"
								height="400"
							/>
							<pre>{result}</pre>
						</div>
					}
				</div>
			}
    </div>
  );
}

export default App;

