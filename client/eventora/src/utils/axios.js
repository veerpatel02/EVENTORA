import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("API Error:", {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message,
//         });

//         return Promise.reject(error);
//     }
// );
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API status:", error.response?.status);

        console.error(
            "API response:",
            JSON.stringify(
                error.response?.data ?? error.message,
                null,
                2
            )
        );

        console.error(
            "API request:",
            error.config?.method?.toUpperCase(),
            error.config?.url
        );

        return Promise.reject(error);
    }
);
export default api;