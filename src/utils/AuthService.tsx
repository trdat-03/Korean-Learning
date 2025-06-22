import type { UserDTO } from "../models/User";

export class AuthService {
  static isLoggedIn(): boolean {
    return !!localStorage.getItem("user");
  }

  static getUser() {
  const user = localStorage.getItem("user");
  if (!user || user === "undefined") return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

  static login(token: string, user: UserDTO) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
} 