import { useEffect, useState } from "react";
import "../styles/boss_selection.css";
import AddCharacterModal from "../components/AddCharacterModal";
import {useNavigate} from "react-router-dom";

function BossSelection() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCharacters = () => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/api/characters/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => setCharacters(data))
    .catch(err => console.error(err));
};

useEffect(() => {
  fetchCharacters();
}, []);

  const bosses = [
    {
      id: 1,
      name: "Ivravul",
      image: "/images/Ivravul.png",
      difficulties: ["Normal", "Hard"],
    },
    {
      id: 2,
      name: "Jaskółka",
      image: "/images/Jaska.png",
      difficulties: ["Easy", "Normal", "Hard"],
    },
    {
      id: 3,
      name: "Konstrukt",
      image: "/images/V2.png",
      difficulties: ["Easy", "Normal", "Hard"],
    },
    {
      id: 4,
      name: "Admirał Utoru",
      image: "/images/Admiral.png",
      difficulties: ["Normal", "Hard"],
    },
  ];

  return (
    <main className="boss-selection">

      {/* ===== SECTION ===== */}
      <section>
        <p>Wybierz lub dodaj postać:</p>

        <div className="card" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus"></i>
          <p>Dodaj postać</p>
        </div>

        {Array.isArray(characters) && characters.map(char => (
          <div
            key={char.id}
            className={`card2 ${selectedCharacter?.id === char.id ? "active" : ""}`}
            onClick={() => setSelectedCharacter(char)}
          >
            <p>{char.name}</p>
            <p>{char.profession}</p>
            <p>{char.level}</p>
            <p>{char.server}</p>
          </div>
        ))}
      </section>

      {/* ===== ASIDE ===== */}
      <aside>
        <h2 className="aside-title">
          Wybierz bossa klikając w ikonkę poziomu trudności
        </h2>

        {bosses.map(boss => (
          <div className="boss-card" key={boss.id}>
            <img src={boss.image} alt={boss.name} />
            <p>{boss.name}</p>

            <div className="difficulty-icons">
              {boss.difficulties.map(diff => (
                <img
                  key={diff}
                  src={`/images/${diff}.png`}
                  alt={diff}
                  onClick={() => {
                    setSelectedBoss(boss);
                    setSelectedDifficulty(diff);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* ===== EXTRA ===== */}
      <div className="extra">
        <h3 className="extra-title">Twój wybór:</h3>

        {selectedCharacter && (
          <div className="card-select">
            <p>{selectedCharacter.name}</p>
            <p>{selectedCharacter.profession}</p>
            <p>{selectedCharacter.level}</p>
            <p>{selectedCharacter.server}</p>
          </div>
        )}

        {selectedBoss && selectedDifficulty && (
          <div className="boss-select">
            <img src={selectedBoss.image} />
            <p>{selectedBoss.name}</p>
            <img src={`/images/${selectedDifficulty}.png`} />
          </div>
        )}

        <div
          className="card-continue"
          onClick={() => {
            if (!selectedCharacter || !selectedBoss || !selectedDifficulty) {
              alert("Wybierz postać, bossa i poziom trudności!");
              return;
            }

            // zapis do localStorage
            localStorage.setItem(
              "selectedCharacter",
              JSON.stringify(selectedCharacter)
            );

            localStorage.setItem(
              "selectedBoss",
              JSON.stringify({
                ...selectedBoss,
                difficulty: selectedDifficulty,
              })
            );

            // przejście do looting
            navigate("/looting");
          }}
        >
          <p>Przejdź do zbierania</p>
        </div>

      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <AddCharacterModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchCharacters();      // odśwież listę
            setIsModalOpen(false);  // zamknij modal
          }}
        />
      )}
    </main>
  );
}

export default BossSelection;
