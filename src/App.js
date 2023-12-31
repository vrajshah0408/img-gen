/** @format */

import { useState } from "react";
import Modal from "./components/Modal";

const App = () => {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const supriseOption = [
    "A red car driving backwards",
    "A blue bike riding on water",
    "A greem plane flying backwards",
    "A yellow boat swimming on land",
  ];

  const uploadImage = async (e) => {
    console.log(e.target.files[0]);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
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

  const generateVariation = async () => {
    setImages(null);
    if (selectedImage === null) {
      setError("Error! must have existing image");
      setModalOpen(false);
      return;
    }
    try {
      const options = {
        method: "POST",
      };
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
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
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            />
          </span>
          to edit
        </p>
        {error && <p>{error}</p>}
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariation={generateVariation}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images ? (
          images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Generated pics of ${value}`}
            />
          ))
        ) : (
          <p>Loading images...</p>
        )}
      </section>
    </div>
  );
};

export default App;
