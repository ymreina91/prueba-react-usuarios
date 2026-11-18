interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return(
    <p className="status" role="status" aria-live="polite">
        {message}
    </p>
  );
}

interface ErrorMsgProps {
  message?: string; 
  onRetry?: () => void; // optional callback for retrying the action
}


export function ErrorMsg({ message = 'An error occurred.', onRetry }: ErrorMsgProps) {
  return (
    <p className="error" role="alert" aria-live="assertive">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Reintentar
        </button>
      )}
    </p>
  );
}
