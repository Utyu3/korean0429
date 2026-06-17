export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('diet_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('diet_user_id', id);
  }
  return id;
}
