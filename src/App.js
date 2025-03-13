import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [temp, setTemp] = useState("");
  const [word, setWord] = useState("");
  const [size, setSize] = useState(400);
  const [bgColor, setBgColor] = useState("ffffff");
  const [qrCode, setQrCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setQrCode(
      `http://api.qrserver.com/v1/create-qr-code/?data=${word}!&size=${size}x${size}&bgcolor=${bgColor}`
    );
  }, [word, size, bgColor]);

  function handleClick() {
    setWord(temp);
  }

  function sendEmail() {
    fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrCodeUrl: qrCode, recipientEmail: email }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => console.error("Erreur:", err));
  }

  return (
    <div className="App">
      <h1>QR Code Générateur</h1>
      <div className="input-box">
        <div className="gen">
          <input type="text" onChange={(e) => setTemp(e.target.value)} placeholder="Enter text to encode" />
          <button className="button" onClick={handleClick}>Générer</button>
        </div>
        <div className="extra">
          <h5>Choisir une couleur de fond</h5>
          <input type="color" onChange={(e) => setBgColor(e.target.value.substring(1))} />
          <h5>Dimension</h5>
          <input type="range" min="200" max="600" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>
      </div>
      <div className="output-box">
        <img src={qrCode} alt="" />
        <a href={qrCode} download="QRCode">
          <button type="button">Télécharger</button>
        </a>
      </div>
      <div className="email-box">
        <h3>Recevoir votre qr code par mail</h3>
        <input type="email" placeholder="Entrer l'email" onChange={(e) => setEmail(e.target.value)} />
        <button onClick={sendEmail}>Envoyer par Email</button>
      </div>
    </div>
  );
}

export default App;
