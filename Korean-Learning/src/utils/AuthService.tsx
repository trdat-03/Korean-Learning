interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export class AuthService {
  static isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }

  static getUser(): User | null {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  static login(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
} 