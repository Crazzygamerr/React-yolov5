import React, { useEffect, useState } from 'react';
import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import './App.css';

function App() {
	const [file, setFile] = useState(null);
	const [prediction, setPrediction] = useState(null);
	const [result, setResult] = useState("");
	const [resultImage, setResultImage] = useState(null);
  const [crop, setCrop] = useState(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	
	async function predict() {
		setResult("");
		setResultImage(null);
		setPrediction(null);
		
		const formData = new FormData();
		formData.append("file", file, file.name);
		if (completedCrop) {
			formData.append("crop", JSON.stringify(completedCrop));
		}
		
		fetch("http://localhost:8000/object-to-json", {
			method: "POST",
			body: formData,
		}).then( async (response) => {
			const result = await response.json();
			setResult(JSON.stringify(result, null, 2));	
			
		});
		
		fetch("http://localhost:8000/object-to-img", {
			method: "POST",
			body: formData,
		}).then( async (response) => {
			const resultImage = await response.blob();
			setResultImage(URL.createObjectURL(resultImage));
		});
		
	}
	
	useEffect(() => {
		if (result) {
			const resultDict = JSON.parse(result)["result"];
			
			const sortedResultDict = resultDict.sort((a, b) => {
				return a.xmin - b.xmin;
			});
			
			const digits = sortedResultDict.map((item) => {
				return item.name;
			});
			setPrediction(digits);
		}
	}, [result]);
	
  return (
		<div className="App">
			<input type="file" onChange={(event) => {
				setFile(event.target.files[0])
				setResult("");
				setResultImage(null);
				setCrop(null);
				setCompletedCrop(null);
				setPrediction(null);
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
					{completedCrop &&
						<p> Crop: {JSON.stringify(completedCrop)}</p>
					}
					<button type="button" onClick={predict}>Predict</button>
					{prediction &&
						<p>Prediction: {prediction}</p>
					}
					{resultImage && 
						<div>
							<img
								src={resultImage}
								alt="result"
								width="400"
								height="400"
							/>
						</div>
					}
					<pre>{result}</pre>
				</div>
			}
    </div>
  );
}

export default App;

