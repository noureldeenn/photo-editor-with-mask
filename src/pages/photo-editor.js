import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";

import "../styles/photo-editor.scss";

const PhotoEditor = () => {
  const[x, setX] = useState(50);
  const[y, setY] = useState(50);
  useEffect(() => {
   // eslint-disable-next-line no-restricted-globals
   if (screen.width < 900) {
     setX(200);
     setY(200);
   }
  }, []);
   
  const exportAsImage = async (el, imageFileName) => {
    // console.log(el)
    const canvas = await html2canvas(el);
    var ctx = canvas.getContext("2d");
    var one = document.getElementById("masked");
    var two = document.getElementById("revealed");
    // composite now
    console.log(one);
    ctx.drawImage(one, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(two, 0, 0);
    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, imageFileName);
  };
  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  };
  const { transform, panZoomHandlers, setPan, setContainer } = usePanZoom({
    maxX: 100,
    maxY: 100,
    minX: -50,
    minY: -50,
  });

  const onDrop = useCallback(
    (droppedFiles) => {
      //
      setPan({ x: x, y: y });
    },
    [setPan, x, y]
  );

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      multiple: false,
      accept: "image/*",
    });

  const selectedImage = acceptedFiles.length > 0 && (
    <img
      id="revealed"
      width={1000}
      height={1000}
      alt={acceptedFiles[0].name}
      key={acceptedFiles[0].path}
      src={URL.createObjectURL(acceptedFiles[0])}
    />
  );
  const exportRef = useRef();
  return (
    <>
      <div className="photo-editor">
        <div className="photo-viewer">
          <div className="screenshot-container" ref={exportRef}>
            <div
              id="masked"
              className="image-outer-container"
              ref={(el) => setContainer(el)}
              {...panZoomHandlers}
            >
              <div className="image-inner-container" style={{ transform }}>
                {selectedImage}
              </div>
            </div>
          </div>
        </div>
        <div className="drop-zone" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="text">
            {isDragActive ? (
              <p>Drop the images here</p>
            ) : (
              <div>
                <i className="n-icon n-icon-upload"></i>
                <p>Drag &amp; Drop or click to select an image</p>
              </div>
            )}
          </div>
        </div>
        <button onClick={() => exportAsImage(exportRef.current, "test")}>
          Capture Image
        </button>
      </div>
    </>
  );
};

export default PhotoEditor;
