import { host } from "./host";

export async function signIn(email, password) {
  try {
    const response = await fetch(`${host}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      // Handle 401 Unauthorized or other errors
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to sign in");
    }

    const data = await response.json();

    saveAccessToken(data);

    console.log("Signed in successfully:", data);
    return data;
  } catch (error) {
    console.error("Sign in failed:", error.message);
    throw error;
  }
}

export function loadAccessToken() {  
    return JSON.parse(localStorage.getItem('accessToken'))
}

export function saveAccessToken(accessToken) {
    localStorage.setItem('accessToken', JSON.stringify(accessToken))
}

export async function authorizeAccessToken() {
  try {
    let {token} = loadAccessToken();
    const response = await fetch(`${host}/api/auth/authorize-access-token`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (e) {
    console.error("Failed to authorize access token", e);
    return false;
  }
}

export async function getUserData() {
  try {
    let {token} = loadAccessToken();

    const response = await fetch(`${host}/api/auth/user-data`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Request failed: ${response.status} ${response.statusText}`);
      return null; // or handle 401/403 specifically
    }

    const data = await response.json();
    return data; // { Username, Email, HomeAddress }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

export async function validateUserAccess() {
  let userData = await getUserData();
  console.log(userData);
  if (userData == null) {
    window.location.href = `/signin`
    return null;
  }

  return userData;
}