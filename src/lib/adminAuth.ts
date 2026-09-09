export const DEFAULT_ADMIN_PASSCODE = "studyfam2027admin";
export const ALLOWED_ADMIN_EMAILS = [
  "dsvsiddharth@gmail.com",
  "may2007siddhu@gmail.com",
];

export function isAuthorizedAdmin(request: Request): boolean {
  const passcodeHeader = request.headers.get("x-admin-passcode");
  const emailHeader = (request.headers.get("x-admin-email") || "").toLowerCase().trim();

  // 1. Passcode match
  const validPasscode = process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;
  if (passcodeHeader && passcodeHeader.trim() === validPasscode) {
    return true;
  }

  // 2. Email match from authenticated session
  const envEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const authorizedEmails = Array.from(new Set([...ALLOWED_ADMIN_EMAILS, ...envEmails]));

  if (emailHeader && authorizedEmails.includes(emailHeader)) {
    return true;
  }

  return false;
}
