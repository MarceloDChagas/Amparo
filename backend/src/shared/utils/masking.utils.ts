export class MaskingUtils {
  static maskCPF(cpf: string): string {
    if (!cpf) return "";
    // Keeps the first 3 digits and the last 2 digits, masking the rest.
    // Format: 123.***.***-** (Standard mask often used in Brazil)
    // Or more obfuscated: ***.***.123-**
    // Let's go with ***.***.###-** where ### are the last 3 digits of the number part, and -** check digits.
    // Common pattern: 123.***.***-45
    // Let's implement: ***.***.890-12 (Show last 3 digits of block and check digits? No, usually first 3 or last 2)
    // Req says "exibições sensíveis".
    // Let's hide middle digits. 123.###.###-12

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return cpf; // Return original if invalid length to avoid breaking UI, or could return masked invalid.

    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
  }

  static maskPhone(phone: string): string {
    if (!phone) return "";
    const cleanPhone = phone.replace(/\D/g, "");

    // (11) 91234-5678 -> (11) *****-5678
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) *****-$3");
    }
    // (11) 1234-5678 -> (11) ****-5678
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) ****-$3");
    }
    return phone;
  }

  static maskEmail(email: string): string {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;

    if (user.length <= 3) {
      return `${user[0]}***@${domain}`;
    }

    // Show first 3 chars, mask the rest until @
    const maskedUser = user.substring(0, 3) + "***";
    return `${maskedUser}@${domain}`;
  }
}
