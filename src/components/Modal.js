import { useState, useRef } from "react"

const Modal = ({setModalOpen, setSelectedImage, selectedImage, generateVariation}) => {
  
  const [error, setError] = useState(null)

    const ref = useRef(null)
  const checkSize = () =>{
    if(ref.current.width === 256 && ref.current.height === 256){
        generateVariation()
    }else{
        setError("Image must be 256x256 pixels")
        }
    }
  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }
    return (
    <div className="modal">
        <div onClick={closeModal}>✘</div>
        <div className="img-container">
            {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt="uploaded image"/>}
        </div>
        <p>{error || "Image must be 256 X 256"} </p>
        {! error && <button onClick={checkSize}>Generate</button>}
        {error && <button onClick={closeModal}>Retry</button>}
        
        
    </div>
  )
}

export default Modal