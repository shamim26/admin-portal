import apiClient from "@/services/apiClient";

export class AuthService {
  static async login(email: string, password: string) {
    const response = await apiClient.post("/users/login", {
      email,
      password,
    });
    return response.data;
  }

  static async me() {
    const response = await apiClient.get("/users");
    return response.data;
  }

  static async logout() {
    const response = await apiClient.post("/users/logout");
    return response.data;
  }
}
