export function handleError(err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    return { success: false, error: err.message };
  }
  console.error(err);
  return { success: false, error: "Unexpected error occurred." };
}
