import { useRef } from 'react';
import { NewPostForm } from './NewPostForm';

interface NewPostDialogProps {
  userId: number;
}

export function NewPostDialog({ userId }: NewPostDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={openDialog} aria-haspopup>Nuevo Post</button>
      <dialog ref={dialogRef} className="new-post-dialog" aria-labelledby="new-post-title">
        <NewPostForm userId={userId} onSuccess={closeDialog} onCancel={closeDialog} />
      </dialog>
    </>
  );
}   