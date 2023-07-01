/** @format */
import { response } from "express";
import { useState } from "react";

const App = () => {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage]= useState(null);
  const supriseOption = [
    "A red car driving backwards",
    "A blue bike riding on water",
    "A greem plane flying backwards",
    "A yellow boat swimming on land",
  ];

  const uploadImage = async(e) =>{
    console.log(e.target.files[0])

    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setSelectedImage(e.target.files[0])

    try{
      const options ={
        method: "POST",
        body: formData
      }
      await fetch('http://localhost:8000/upload',options)
      const data =await response.json()
      
    }catch(error){
      console.error(error)
    }
  }
  const supriseMe = () => {
    setImages(null);
    const randomValue =
      supriseOption[Math.floor(Math.random() * supriseOption.length)];
    setValue(randomValue);
  };

  const getImages = async () => {
    setImages(null);
    if (value === null) {
      setError("Error Must have search term!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(value);
  return (
    <div className="App">
      <section className="search-section">
        <p>
          Start with a detailed description
          <span className="suprise" onClick={supriseMe}>
            Suprise Me
          </span>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="An impressionist oil painting of a sunflower in a red vase"
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or,
          <span>
            <label htmlFor="files"> Upload an image </label>
            <input onChange={uploadImage} id="files" accept="image/*" type="file" hidden />
          </span>
          to edit
        </p>
        {error && <p>{error}</p>}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img
            key={_index}
            src={image.url}
            alt={`Generated image of ${value}`}
          />
        ))}
      </section>
    </div>
  );
};

export default App;
