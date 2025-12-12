type AuthFieldErrors = Partial<Record<'email' | 'password' | 'token', string>>;

export function mapAuthError(err: any): { fieldErrors?: AuthFieldErrors; message?: string } {
  if (!err) return {};

  // Field-level errors (from backend validation)
  if (err.errors) return { fieldErrors: err.errors };

  // Common auth-specific checks
  const msg = err.message?.toLowerCase?.() || '';
  const fieldErrors: AuthFieldErrors = {};

  if (msg.includes('email')) fieldErrors.email = err.message;
  else if (msg.includes('password')) fieldErrors.password = err.message;
  else if (msg.includes('token')) fieldErrors.token = err.message;

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  // Fallback general message

  return { message: err.message || 'authentication failed' };
}
