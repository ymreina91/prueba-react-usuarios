import type { User } from '../../api/types';
import { ErrorMsg, Loading } from '../../components/Status';
import { useUserPosts } from './usePosts';

interface UserPostsProps {
  user: User;
}

export function UserPosts({ user }: UserPostsProps) {
  const { data: posts = [], isLoading, isError, refetch } = useUserPosts(user.id);

  return (
    <section className="posts" aria-label="Publicaciones del usuario">
      <h2 id="posts-title">Publicaciones de {user.name}</h2>

      {isLoading && <Loading message="Cargando publicaciones..." />}
      {isError && <ErrorMsg message="Error al cargar publicaciones." onRetry={refetch} />}

      {!isLoading && !isError && posts.length === 0 && (
        <p className="no-results">No hay publicaciones para este usuario.</p>
      )}

      {posts.length > 0 && (
        <ul className="post-list" aria-labelledby="posts-title">
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
