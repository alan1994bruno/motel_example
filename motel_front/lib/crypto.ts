import CryptoJS from "crypto-js";

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(
    data,
    process.env.SECRET_KEY || "server_key"
  ).toString();
}

export function decryptData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(
    cipherText,
    process.env.SECRET_KEY || "server_key"
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}
