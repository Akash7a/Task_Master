import { useDispatch } from "react-redux";
import { tokenRefreshed } from "../features/AuthSlice.js";
import { refreshToken } from "../utils/apiClient.js";
import { useEffect } from "react";

const useTokenRefresh = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const newAccessToken = await refreshToken();
                console.log("Token refreshed:", newAccessToken); // Log to verify it's working
                dispatch(tokenRefreshed({ accessToken: newAccessToken }));
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        },  14 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dispatch]);
};

export default useTokenRefresh;