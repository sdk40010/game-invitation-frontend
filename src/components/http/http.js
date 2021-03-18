/**
 * APIサーバーにリクエストを送る
 * レスポンスのステータスコードが200番台でないときはエラーを投げる
 * 
 * @param {string} path - APIのパス
 * @param {string} method - HTTPメソッド
 * @param {Object} body - 送信データ
 * @returns {Object} json - JSONレスポンス
 * @throws {Error} エラーレスポンス
 */
export default async function apiCall(path, method, body = null) {
    const apiServerURL = process.env.REACT_APP_API_SERVER_URL;
    const xsrfToken = document
        .cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN"))
        ?.split("=")[1]
        || "";

    const res = await fetch(apiServerURL + path, { 
        method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        body: method === "GET" ? body : JSON.stringify(body)
    }).catch(err => {
        throw err;
    });

    if (res.ok) {
        return await res.json();
    } else {
        handleError(res);
    }
}

const handleError = (res) => {
    switch (res.status) {
      case 400: throw new Error("Bad Request");
      case 401: throw new Error("Unauthorized");
      case 403: throw new Error("Forbidden");
      case 404: throw new Error("Not Found");
      case 419: throw new Error("CSRF Token Mismatch")
      case 500: throw new Error("Internal Server Error");
      case 502: throw new Error("Bad Gateway");
      default:  throw new Error("Unhandled Error");
    } 
  };