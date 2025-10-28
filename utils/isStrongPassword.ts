export function isStrongPassword(password: string) {
  // At least 8 chars, one uppercase, one lowercase, one digit, one special char
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
}
