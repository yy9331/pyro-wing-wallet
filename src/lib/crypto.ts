export type EncryptedPayload = {
    v: number
    salt: string
    iv: string
    data: string
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const toBase64 = (data: Uint8Array) => btoa(String.fromCharCode(...data))
export const fromBase64 = (data: string) => new Uint8Array(atob(data).split("").map((c) => c.charCodeAt(0)))

export const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
	const keyMaterial = await crypto.subtle.importKey(
		"raw", 
		textEncoder.encode(password), 
		"PBKDF2", 
		false, 
		["deriveKey"]
	)
	return await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	)
} 

export const encryptJson = async (json: Object, password: string): Promise<EncryptedPayload> => {
	const salt = crypto.getRandomValues(new Uint8Array(12))
	const iv = crypto.getRandomValues(new Uint8Array(12))
	const key = await deriveKey(password, salt)
	const plaintext = textEncoder.encode(JSON.stringify(json))
	const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext))
	return {
		v: 1,
		salt: toBase64(salt),
		iv: toBase64(iv),
		data: toBase64(ciphertext),
	}
}

export const decryptJson = async <T>(payload: EncryptedPayload, password: string): Promise<T> => {
	const salt = fromBase64(payload.salt)
	const iv = fromBase64(payload.iv)
	const key = await deriveKey(password, salt)
	const ciphertext = fromBase64(payload.data)
	const plaintext = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext))
	const jsonString = textDecoder.decode(plaintext)
	return JSON.parse(jsonString)
}
