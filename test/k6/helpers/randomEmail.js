export function randomEmail() {
  const rand = Math.random().toString(36).substring(2, 10);
  return `user_${rand}@test.com`;
}
