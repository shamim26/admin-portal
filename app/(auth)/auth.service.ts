import apiClient from "@/services/apiClient";

export class AuthService {
  static async login(email: string, password: string) {
    const response = await apiClient.post("/users/login", {
      email,
      password,
    });
    return response;
  }

  static async guestLogin() {
    const response = await apiClient.post("/users/guest-login");
    return response;
  }

  static async getUser() {
    const response = await apiClient.get("/users");
    return response;
  }

  static async logout() {
    const response = await apiClient.post("/users/logout");
    return response;
  }
}
