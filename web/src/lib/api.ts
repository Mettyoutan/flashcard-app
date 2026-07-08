// Helper untuk panggil API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) throw new Error("API_URL missing.");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type ApiFetchOptions = {
  method: string;
  body?: unknown;
  headers?: HeadersInit;
};

/**
 * Function helper untuk bantu fetch api
 * @param path - path dari api yang mau di fecth, tanpa prefix http://localhost:3000
 * @param options
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = { method: "GET" },
) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method,
    credentials: "include", // Wajib agar cookie tidak dibuang
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Masukin Authorization header
      ...options.headers,
    },
    // Kirim body ke API dalam JSON string
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // Kalau response error (bukan 200 - 299)
  if (!res.ok) {
    // Karena pasti ada error, langsung catch error dan return {message}
    const errorBody = await res.json().catch(() => ({
      message: "Request Failed",
    }));

    throw new ApiError(errorBody.message ?? "Request failed", res.status);
  }

  // Response = NoContent
  // Return value undefined saja
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
