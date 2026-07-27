const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";

function getStoredAuthentication()
{
    const localAuthentication =
        localStorage.getItem(
            "habit-tracker-auth"
        );

    const sessionAuthentication =
        sessionStorage.getItem(
            "habit-tracker-session-auth"
        );

    const storedAuthentication =
        localAuthentication ||
        sessionAuthentication;

    if (!storedAuthentication)
    {
        return null;
    }

    try
    {
        return JSON.parse(
            storedAuthentication
        );
    }
    catch
    {
        return null;
    }
}

function getAuthenticationToken()
{
    const authentication =
        getStoredAuthentication();

    return authentication?.token || null;
}

async function parseResponse(response)
{
    const contentType =
        response.headers.get(
            "content-type"
        ) || "";

    let body = null;

    if (
        contentType.includes(
            "application/json"
        )
    )
    {
        body = await response.json();
    }
    else
    {
        const text =
            await response.text();

        body = text
            ? { message: text }
            : null;
    }

    if (!response.ok)
    {
        const error =
            new Error(
                body?.message ||
                body?.error ||
                `Request failed with status ${response.status}.`
            );

        error.status =
            response.status;

        error.data = body;

        throw error;
    }

    return body;
}

export async function apiRequest(
    path,
    options = {}
)
{
    const {
        method = "GET",
        body,
        headers = {},
        signal,
        requiresAuthentication = true
    } = options;

    const token =
        getAuthenticationToken();

    const requestHeaders = {
        Accept: "application/json",
        ...headers
    };

    if (
        body !== undefined &&
        !(body instanceof FormData)
    )
    {
        requestHeaders["Content-Type"] =
            "application/json";
    }

    if (
        requiresAuthentication &&
        token
    )
    {
        requestHeaders.Authorization =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            method,
            headers: requestHeaders,

            body:
                body === undefined
                    ? undefined
                    : body instanceof FormData
                        ? body
                        : JSON.stringify(body),

            signal
        }
    );

    return parseResponse(response);
}

export function getApiBaseUrl()
{
    return API_BASE_URL;
}