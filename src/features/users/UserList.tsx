import { useMemo, useState } from "react";
import { ErrorMsg, Loading } from "../../components/Status";
import { filterUsersByName } from "../../features/users/filterUsers";
import { useUsers } from "./useUsers";

interface UserListProps {
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
}

export function UserList({ selectedUserId, onSelectUser }: UserListProps) {
    const { data: users = [], isLoading, isError, refetch } = useUsers();
    const [query, setQuery] = useState('');

    const filteredUsers = useMemo(() => filterUsersByName(users, query), [users, query]); 
    
    return (
        <section className="users" area-label="User List">
            <h2 id="users-title">Usuarios</h2>

            <label htmlFor="user-search">Buscar por nombre:</label>
            <input
                id="user-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe un nombre..."
                autoComplete="off"
            />

            {isLoading && <Loading message="Cargando usuarios..." />}
            {isError && <ErrorMsg message="Error al cargar usuarios." onRetry={refetch} />}

            {!isLoading && !isError && filteredUsers.length === 0 && (
                <p className="no-results">Ningún usuario coincide con «{query}».</p>
            )}

            {filteredUsers.length > 0 &&  (
                <ul className="user-list" aria-labelledby="users-title">
                    {filteredUsers.map((user) => (
                        <li key={user.id}>
                            <button 
                            type="button"
                            className="user-button"
                            aria-pressed={selectedUserId === user.id}    
                            onClick={() => onSelectUser(user.id)}>
                                <span className="user-name">{user.name}</span>
                                <small>({user.email})</small>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}   

