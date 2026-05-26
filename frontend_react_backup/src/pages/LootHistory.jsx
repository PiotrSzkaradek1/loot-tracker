import { useEffect, useState } from "react";
import "../styles/loot_history.css";

function LootHistory() {

  /* ================= STATE ================= */

  const [character, setCharacter] = useState(null);
  const [boss, setBoss] = useState(null);

  const [history, setHistory] = useState(null);

  const [showRars, setShowRars] = useState(false);
  const [showSyngs, setShowSyngs] = useState(false);
  const [showDrifs, setShowDrifs] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  /* ================= LOAD ================= */

  useEffect(() => {

    const loadHistory = async () => {

      try {

        const charLS = localStorage.getItem("selectedCharacter");
        const bossLS = localStorage.getItem("selectedBoss");

        if (!charLS || !bossLS) {
          setError("Brak wybranej postaci lub bossa");
          setLoading(false);
          return;
        }

        const charData = JSON.parse(charLS);
        const bossData = JSON.parse(bossLS);

        setCharacter(charData);
        setBoss(bossData);

        const token = localStorage.getItem("token");

        const url = `http://localhost:3000/api/history` +
          `?characterId=${charData.id}` +
          `&bossId=${bossData.id}` +
          `&difficulty=${bossData.difficulty}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Błąd pobierania historii");
        }

        const data = await res.json();

        setHistory(data);

      } catch (err) {

        console.error(err);
        setError("Nie udało się pobrać historii");

      } finally {
        setLoading(false);
      }

    };

    loadHistory();

  }, []);


  /* ================= RENDER ================= */

  if (loading) return <p>Ładowanie...</p>;

  if (error) return <p className="error">{error}</p>;

  if (!history || !character || !boss) {
    return <p>Brak danych</p>;
  }


  return (

    <main>


      {/* ===== LEFT: CHARACTER ===== */}

      <section>

        <div className="card2 selected">

          <p>{character.name}</p>
          <p>{character.profession}</p>
          <p>{character.level}</p>
          <p>{character.server}</p>

        </div>

      </section>


      {/* ===== MIDDLE: BOSS ===== */}

      <aside>

        <h2 className="aside-title">
          Wybrany boss
        </h2>

        <div className="boss-card">

          <img src={boss.image} alt={boss.name} />

          <p>{boss.name}</p>

          <div className="difficulty-icons">

            <img
              src={`/images/${boss.difficulty}.png`}
              alt={boss.difficulty}
              className="selected"
            />

          </div>

        </div>

      </aside>


      {/* ===== RIGHT: SUMMARY ===== */}

      <div className="extra">

        <h3 className="extra-title">Twój wybór:</h3>


        {/* CHARACTER */}

        <div className="card-select">

          <p>{character.name}</p>
          <p>{character.profession}</p>
          <p>{character.level}</p>
          <p>{character.server}</p>

        </div>


        {/* BOSS */}

        <div className="boss-select">

          <img src={boss.image} alt={boss.name} />

          <p>{boss.name}</p>

          <img
            src={`/images/${boss.difficulty}.png`}
            alt="difficulty"
          />

        </div>


        {/* SUMMARY */}

        <div id="stash-summary">

          <p>
            Suma złota:
            <span> {history.totalGold}</span>
          </p>


          {/* ITEMS */}

          <h4>Itemy:</h4>

          {history.items.length === 0 ? (

            <p>Brak itemów</p>

          ) : (

            <table className="summary-table">

              <thead>
                <tr>
                  <th>Item</th>
                  <th>Ilość</th>
                </tr>
              </thead>

              <tbody>

                {history.items.map((item, i) => (

                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.total}</td>
                  </tr>

                ))}

              </tbody>

            </table>

          )}


          {/* BUTTONS */}

          <div className="summary-buttons">

            <button onClick={() => setShowRars(true)}>
              Pokaż Rary
            </button>

            <button onClick={() => setShowSyngs(true)}>
              Pokaż Synergetyki
            </button>

            <button onClick={() => setShowDrifs(true)}>
              Pokaż Drify
            </button>

          </div>


          {/* RARS MODAL */}

          {showRars && (

            <div className="modal">

              <button onClick={() => setShowRars(false)}>
                Zamknij
              </button>

              <table>

                <thead>
                  <tr>
                    <th>Rar</th>
                    <th>Quality</th>
                    <th>Ilość</th>
                  </tr>
                </thead>

                <tbody>

                  {history.rars.map((r, i) => (

                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.quality}</td>
                      <td>{r.total}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}


          {/* SYNG MODAL */}

          {showSyngs && (

            <div className="modal">

              <button onClick={() => setShowSyngs(false)}>
                Zamknij
              </button>

              <table>

                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Ilość</th>
                  </tr>
                </thead>

                <tbody>

                  {history.syngs.map((s, i) => (

                    <tr key={i}>
                      <td>{s.quality}</td>
                      <td>{s.total}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}


          {/* DRIFS MODAL */}

          {showDrifs && (

            <div className="modal">

              <button onClick={() => setShowDrifs(false)}>
                Zamknij
              </button>

              <table>

                <thead>
                  <tr>
                    <th>Drif</th>
                    <th>Tier</th>
                    <th>Ilość</th>
                  </tr>
                </thead>

                <tbody>

                  {history.drifs.map((d, i) => (

                    <tr key={i}>
                      <td>{d.name}</td>
                      <td>{d.tier}</td>
                      <td>{d.total}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>

  );
}

export default LootHistory;
