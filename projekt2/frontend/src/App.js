import './App.css';
import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from 'react';

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [notes, setNotes] = useState([]);
  const [userSummary, setUserSummary] = useState([]);
  const [newNote, setNewNote] = useState("");

  const fetchData = async () => {
    if (!keycloak.token) return;
    try {
      const token = keycloak.token;
      console.log(token);
      
      const res = await fetch("http://localhost/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (keycloak.hasRealmRole("admin")) {
            setUserSummary(data);
            const adminUsername = keycloak.tokenParsed?.preferred_username;
            setNotes(data.filter(note => note.name === adminUsername));
          } else {
            setNotes(data);
          }
        } else {
          if (keycloak.hasRealmRole("admin")) {
            setUserSummary([]);
            setNotes([]);
          } else {
            setNotes([]);
          }
        }
      } else {
        if (keycloak.hasRealmRole("admin")) {
          setUserSummary([]);
          setNotes([]);
        } else {
          setNotes([]);
        }
      }
    } catch (e) {
      if (keycloak.hasRealmRole("admin")) {
        setUserSummary([]);
        setNotes([]);
      } else {
        setNotes([]);
      }
    }
  };

  useEffect(() => {
    if (initialized && keycloak.authenticated && keycloak.token) {
      fetchData();
    } else {
      setNotes([]);
      setUserSummary([]);
    }
  }, [keycloak.authenticated, keycloak.token, initialized]);


  const handleCreateNote = async () => {
    if (!newNote.trim() || !keycloak.token) return;
    const token = keycloak.token;

    try {
      const res = await fetch("http://localhost/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          note: newNote
        })
      });

      if (res.ok) {
        fetchData();
        setNewNote("");
      }
    } catch (err) {
      // Handle error appropriately
    }
  };

  if (!initialized) return <div>Loading...</div>;

  const commonNoteInput = (
    <div className='ib'>
      <input
        type="text"
        placeholder="Write a new note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className='ib'
      />
      <button onClick={handleCreateNote} disabled={!newNote.trim()} className='ib'>
        Add Note
      </button>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        {keycloak.authenticated ? (
          <>
            <p>
              Welcome, {keycloak.hasRealmRole("admin") && "admin "}{keycloak.tokenParsed?.preferred_username}!
            </p>
            <button onClick={() => keycloak.logout()}>Logout</button>

            {keycloak.hasRealmRole("admin") ? (
              <div className='outcon'>
                <div className='incon'>
                  <h2>Your Notes</h2>
                  {commonNoteInput}
                  <ul className='no-dots'>
                    {notes.map(note => (
                      <li key={note.id}>{note.note}</li>
                    ))}
                  </ul>
                </div>
                <div className='ap'>
                  <h2>Admin Panel (Recently Added Notes)</h2>
                  <ul className='no-dots'>
                    {userSummary.map(summaryItem => (
                      <li key={summaryItem.id}>
                        <strong>{summaryItem.name}:</strong> {summaryItem.note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <h2>Your Notes</h2>
                {commonNoteInput}
                <ul>
                  {notes.map(note => (
                    <li key={note.id}>{note.note}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <>
            <p>You are not logged in</p>
            <div className='ib'>
              <button onClick={() => keycloak.login()}>Login</button>
              <button onClick={() => keycloak.register()}>Register</button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;