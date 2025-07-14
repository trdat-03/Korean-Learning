import type { UserDTO } from "../models/User";

export class AuthService {
  static isLoggedIn(): boolean {
    return !!localStorage.getItem("user");
  }

  static getUser(): UserDTO | null {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    try {
      return JSON.parse(user) as UserDTO;
    } catch {
      return null;
    }
  }

  static login(user: UserDTO) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem("user");
  }
}
