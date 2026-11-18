import { useState } from 'react';
import { UserList } from './features/users/UserList';
import { UserPosts } from './features/posts/UserPosts';
import { useUsers } from './features/users/useUsers';
import type { User } from './api/types';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users } = useUsers();
  const selectedUser = users?.find((user) => user.id === selectedUserId) as User | undefined;

  return (
    <div className="layout">
      <h1>Usuarios y publicaciones</h1>

      <div className="content">
        <UserList 
          selectedUserId={selectedUserId} 
          onSelectUser={setSelectedUserId} 
        />

        <main className="posts" area-label="Posts">
          {selectedUser ? (
            <UserPosts key={selectedUser.id} user={selectedUser} />
          ) : (
            <p className="no-user-selected">Selecciona un usuario para ver sus publicaciones.</p>
          )}
        </main>
      </div>
    </div>
  )
}

export default App;