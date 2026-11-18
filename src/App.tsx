import { useState } from 'react';
import { UserList } from './features/users/UserList';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <div className="layout">
      <h1>Usuarios y publicaciones</h1>

      <div className="content">
        <UserList 
          selectedUserId={selectedUserId} 
          onSelectUser={setSelectedUserId} 
        />

        <main className="posts" area-label="Posts">
          {selectedUserId ? (
            <p>Mostrando publicaciones del usuario con ID: {selectedUserId}</p>
          ) : (
            <p>Selecciona un usuario para ver sus publicaciones.</p>
          )}
        </main>
      </div>
    </div>
  )
}

export default App;