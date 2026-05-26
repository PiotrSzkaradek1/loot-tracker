import { useEffect, useState } from "react";
import "../styles/looting.css";

function Looting() {

  /* ================= STATE ================= */

  const [boss, setBoss] = useState(null);
  const [character, setCharacter] = useState(null);

  const [gold, setGold] = useState(0);
  const [tracks, setTracks] = useState(0);

  const [items, setItems] = useState([]);

  const [rars, setRars] = useState([]);
  const [drifs, setDrifs] = useState([]);

  const [itemAmounts, setItemAmounts] = useState({});

  const [selectedRar, setSelectedRar] = useState("");
  const [rarQuality, setRarQuality] = useState(1);

  const [syngQuality, setSyngQuality] = useState(1);

  const [selectedDrif, setSelectedDrif] = useState("");
  const [drifTier, setDrifTier] = useState(1);

  const [cart, setCart] = useState([]);

  const [bossData, setBossData] = useState(null);

  const [error, setError] = useState("");


  /* ================= LOAD DATA ================= */

useEffect(() => {

  const loadData = async () => {

    try {

      const savedBoss = localStorage.getItem("selectedBoss");
      const savedChar = localStorage.getItem("selectedCharacter");

      if (!savedBoss || !savedChar) {
        setError("Brak wybranych danych. Wróć do wyboru.");
        return;
      }

      const bossDataLS = JSON.parse(savedBoss);
      const charDataLS = JSON.parse(savedChar);

      setBoss(bossDataLS);
      setCharacter(charDataLS);

      const token = localStorage.getItem("token");

      // FETCH Z BACKENDU
      const res = await fetch(
        `http://localhost:3000/api/loot/loot-data?bossId=${bossDataLS.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error("Błąd pobierania danych loota");
      }

      const data = await res.json();

      // SET STATE Z BACKENDU
      setBossData(data.bossData);
      setItems(data.items);
      setRars(data.rars);
      setDrifs(data.drifs);
      setSyngQuality(data.bossData.min_syng);

    } catch (err) {

      console.error(err);
      setError("Nie udało się załadować danych");

    }

  };

  loadData();

}, []);



  /* ================= HANDLERS ================= */

  const handleItemChange = (id, value) => {

    setItemAmounts(prev => ({
      ...prev,
      [id]: Number(value)
    }));

  };


  const addRar = () => {

    if (!selectedRar) return;

    const rar = rars.find(r => r.id === Number(selectedRar));

    if (!rar) return;

    setCart(prev => [
      ...prev,
      {
        type: "rar",
        id: rar.id,
        name: rar.name,
        quality: rarQuality
      }
    ]);

  };


  const addSyng = () => {
    console.log("Dodawanie synga, wartość:", syngQuality, typeof syngQuality);
    setCart(prev => [
      ...prev,
      {
        type: "syng",
        quality: syngQuality
      }
    ]);

  };


  const addDrif = () => {

    if (!selectedDrif) return;

    const drif = drifs.find(d => d.id === Number(selectedDrif));

    if (!drif) return;

    setCart(prev => [
      ...prev,
      {
        type: "drif",
        id: drif.id,
        name: drif.name,
        tier: drifTier
      }
    ]);

  };


  const removeFromCart = (index) => {

    setCart(prev =>
      prev.filter((_, i) => i !== index)
    );

  };


  /* ================= SUBMIT ================= */

const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const token = localStorage.getItem("token");

    const payload = {
      boss,
      character,
      gold,
      tracks,
      items: itemAmounts,
      cart
    };

    const res = await fetch(
      // FETCH
      "http://localhost:3000/api/loot/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      throw new Error("Błąd zapisu loota");
    }

    const data = await res.json();

    alert("Loot zapisany w bazie! ID: " + data.recordId);

    console.log("Zapisano:", data);

  } catch (err) {

    console.error(err);
    setError("Nie udało się zapisać loota");

  }
};



  if (!boss || !character || !bossData) {
    return <p>Ładowanie...</p>;
  }


  /* ================= JSX ================= */

  return (

    <main>


      {/* ===== INFO ===== */}

      <section id="looting-info">

        <h3 className="extra-title">Twój wybór:</h3>

        <div className="boss-select">
          <img src={boss.image} alt={boss.name} />
          <p>{boss.name}</p>
          <img src={`/images/${boss.difficulty}.png`} alt="" />
        </div>


        <div className="card-select">
          <p>{character.name}</p>
          <p>{character.profession}</p>
          <p>{character.level}</p>
          <p>{character.server}</p>
        </div>

      </section>


      {/* ===== ASIDE ===== */}

      <aside>

        <form onSubmit={handleSubmit}>


          {/* GOLD / TRACKS */}

          <label>
            Złoto:
            <input
              type="number"
              min="0"
              value={gold}
              onChange={e => setGold(Number(e.target.value))}
            />
          </label>

          <br />

          <label>
            Tropy:
            <input
              type="number"
              min="0"
              value={tracks}
              onChange={e => setTracks(Number(e.target.value))}
            />
          </label>

          <br />


          {/* ITEMS */}

          <h3>Itemy:</h3>

          {items.length === 0 && (
            <p>Brak itemów</p>
          )}

          {items.map(item => (

            <label key={item.id}>

              {item.name}

              <input
                type="number"
                min="0"
                value={itemAmounts[item.id] || 0}
                onChange={e =>
                  handleItemChange(item.id, e.target.value)
                }
              />

            </label>

          ))}


          {/* RARS */}

          <h3>Dodaj Rara:</h3>

          <select
            value={selectedRar}
            onChange={e => setSelectedRar(e.target.value)}
          >

            <option value="">-- wybierz --</option>

            {rars.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}

          </select>


          <select
            value={rarQuality}
            onChange={e => setRarQuality(Number(e.target.value))}
          >

            {[1,2,3,4,5,6,7,8,9].map(q => (
              <option key={q} value={q}>
                Jakość {q}
              </option>
            ))}

          </select>


          <button type="button" onClick={addRar}>
            Dodaj Rara
          </button>


          {/* SYNG */}

          <h3>Dodaj Synergetyk:</h3>

          <select
            value={syngQuality}
            onChange={e => setSyngQuality(Number(e.target.value))}
          >

            {Array.from(
              { length: bossData.max_syng - bossData.min_syng + 1 },
              (_, i) => bossData.min_syng + i
            ).map(q => (
              <option key={q} value={q}>
                Jakość {q}
              </option>
            ))}

          </select>


          <button type="button" onClick={addSyng}>
            Dodaj Synergetyk
          </button>


          {/* DRIFS */}

          <h3>Dodaj Drifa:</h3>

          <select
            value={selectedDrif}
            onChange={e => setSelectedDrif(e.target.value)}
          >

            <option value="">-- wybierz --</option>

            {drifs.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}

          </select>


          <select
            value={drifTier}
            onChange={e => setDrifTier(Number(e.target.value))}
          >

            {Array.from(
              { length: bossData.tier },
              (_, i) => i + 1
            ).map(t => (
              <option key={t} value={t}>
                Tier {t}
              </option>
            ))}

          </select>


          <button type="button" onClick={addDrif}>
            Dodaj Drifa
          </button>


          {/* CART */}

          <h4>Elementy ekwipunku:</h4>

          <ul>

            {cart.map((el, i) => (

              <li key={i}>

              {el.type === "rar" && (
                <>
                  <span className="loot-type">RAR:{" "}
                  {el.name} ({el.quality})
                  </span>
                </>
              )}

              {el.type === "syng" && (
                <>
                  <span className="loot-type">SYNG:{" "}
                  {el.quality}
                  </span>
                </>
              )}

              {el.type === "drif" && (
                <>
                  <span className="loot-type">DRIF:{" "}
                  {el.name} (T{el.tier})
                  </span>
                </>
              )}

                <button
                  type="button"
                  onClick={() => removeFromCart(i)}
                >
                  X
                </button>

              </li>

            ))}

          </ul>


          {error && <p className="error">{error}</p>}


          <button type="submit">
            Zapisz loot
          </button>


        </form>

      </aside>


      {/* ===== EXTRA ===== */}

      <div className="extra"></div>


    </main>

  );
}

export default Looting;
