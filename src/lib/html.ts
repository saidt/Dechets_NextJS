export async function getResponseJson(response: Response) : Promise<any> {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
    // Handle JSON data
  } else {
    return await response.text();
    // Handle non-JSON response
  }
}

export async function getResponseData(response: Response, title: string) : Promise<any> {
  const data = await getResponseJson(response)
  if (!response.ok) {
    var error: string
    if (data.error) {
      error=data.error
    }
    else {
      error=`${title}: ${response.status} / ${response.statusText}`;
    }
    throw new Error(error)
  }
  return data;
}

export function getAllCookies() {
  if (typeof document === 'undefined') {
    return ''
  }

  return document.cookie
}