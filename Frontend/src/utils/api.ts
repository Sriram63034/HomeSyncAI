export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getAuthHeaders = () => {
    const token = localStorage.getItem('access');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(getAuthHeaders() as Record<string, string>),
    };
    
    const headers = {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData);
        } catch (e) {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
};
