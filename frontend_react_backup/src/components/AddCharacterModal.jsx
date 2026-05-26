import { useState } from "react";

function AddCharacterModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [profession, setProfession] = useState("");
  const [server, setServer] = useState("");
  const [error, setError] = useState("");
  {/*W przypadku aktualizacji gry zmienić wartości professions i server (czyli nigdy)*/}
  const professions = ["Rycerz","Łucznik","Sheed","Barbarzyńca","Druid","Voodoo","Mag Ognia"];
  const servers = ["Thanar","Veskara","Vardis"];


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(level < 1 || level > 140){
      setError("Level musi być w zakresie 1-140!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          level,
          profession,
          server,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Błąd dodawania postaci");
        return;
      }

      onSuccess(); // odśwież listę
      onClose();   // zamknij modal
    } catch (err) {
      console.error(err);
      setError("Błąd połączenia z serwerem");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Dodaj postać</h2>

        {error && <p className="error">{error}</p>}
        {/* TO DO - dodać dropdown menu do profek i serwerów */}
        <form onSubmit={handleSubmit}>
        
          <input placeholder="Nick" value={name} onChange={e => setName(e.target.value)} />
          <input type="number" placeholder="Level" value={level} min="1" max="140" onChange={e => setLevel(Number(e.target.value))} required/>
          <div className="form-control">
              <label htmlFor="profession">Profesja</label>
              <select id="profession" value={profession} onChange={(e) => setProfession(e.target.value)}
              required
            >
              <option value="">-- Wybierz profesję --</option>
              {professions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            </div>
          {/*<input placeholder="Server" value={server} onChange={e => setServer(e.target.value)} />*/}
          <div className="form-control">
              <label htmlFor="server">Server</label>
              <select id="server" value={server} onChange={(e) => setServer(e.target.value)}
              required
            >
              <option value="">-- Wybierz serwer --</option>
              {servers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Dodaj</button>
          <button type="button" onClick={onClose}>Anuluj</button>
        </form>
      </div>
    </div>
  );
}

export default AddCharacterModal;
