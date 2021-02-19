/**
 * バックエンドのAPIサーバーにアクセスする
 * レスポンスのステータスコードが200番台でないときはエラーを投げる
 */
export default async function apiCall (path, method, bodyData = {}) {
    const apiServerRoot = process.env.REACT_APP_API_SERVER_ROOT;
    const xsrfToken = document
        .cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1]
        || "";

    const res = await fetch(apiServerRoot + path, { 
        method: method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        body: method === "GET" ? null : JSON.stringify(bodyData)
    }).catch(err => {
        throw new Error(err.message);
    });

    if (res.ok) {
        return await res.json();
    } else {
        handleError(res);
    }
}

const handleError = (res) => {
    switch (res.status) {
      case 400: throw Error("Bad Request");
      case 401: throw Error("Unauthorized");
      case 404: throw Error("Not Found");
      case 419: throw Error("CSRF Token Mismatch")
      case 500: throw Error("Internal Server Error");
      case 502: throw Error("Bad Gateway");
      default:  throw Error("Unhandled Error");
    } 
  };