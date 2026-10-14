import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Learnly` : 'Learnly – Learn without limits';
  }, [title]);
}
