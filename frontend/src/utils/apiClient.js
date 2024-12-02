import axios from "axios";

export const refreshToken = async () => {
    try {
        const response = await axios.post("/api/v1/users/refresh-token", {}, { withCredentials: true });

        console.log("response", response);
        console.log("Response Data:", response.data);

        const { accessToken } = response.data?.data || {};
        if (!accessToken) {
            throw new Error("AccessToken missing from the response");
        }

        return accessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};

const apiClient = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                throw refreshError;
            }
        }

        return Promise.reject(error);
    }
);


export default apiClient;