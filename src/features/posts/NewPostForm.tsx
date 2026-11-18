import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ErrorMsg } from '../../components/Status';
import { useCreatePost } from './useCreatePost';

const postSchema = z.object({ 
  title: z.string().trim().min(1, 'El título es obligatorio').max(120, 'El título no puede superar los 120 caracteres'),
  body: z.string().trim().min(1, 'El texto es obligatorio'),
});

type PostFormData = z.infer<typeof postSchema>;

interface NewPostFormProps {
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void; 
}

export function NewPostForm({ userId, onSuccess, onCancel }: NewPostFormProps) {
  const createPost = useCreatePost(userId);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

    const onSubmit = (values: PostFormData) => {
        createPost.mutate(values, {
            onSuccess: () => {
                reset(); 
                onSuccess?.(); 
            }
        });
    };

    const handleCancel = () => {
        reset();
        createPost.reset();
        onCancel?.();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="post-form">
        <h3 id="new-post-title">Nueva Publicación</h3>

        <div className="field">
            <label htmlFor="title">Título</label>
            <input
                id="title"
                type="text"
                {...register('title')}
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
                <p id="title-error" className="field-error">
                    {errors.title.message}
                </p>
            )}
        </div>
        <div className="field">
            <label htmlFor="body">Texto</label>
            <textarea
                id="body"
                {...register('body')}
                aria-invalid={errors.body ? 'true' : 'false'}
                aria-describedby={errors.body ? 'body-error' : undefined}
            />
            {errors.body && (
                <p id="body-error" className="field-error">
                    {errors.body.message}
            </p>)}
        </div>
        {createPost.isError && (
            <ErrorMsg message="No pudimos publicar. Inténtalo de nuevo."/>
        )}
        <div className="form-actions">
            <button type="button" className="button-secondary" onClick={handleCancel}>
                Cancelar
            </button>
            <button type="submit" disabled={createPost.isPending}>
                {createPost.isPending ? 'Publicando…' : 'Publicar'}
            </button>
        </div>
    </form>
  )
}