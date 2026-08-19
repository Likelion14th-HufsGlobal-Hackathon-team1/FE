const BASE_URL = "http://1.201.116.149:8080";

/**
 * 공통 fetch 래퍼.
 * - 저장된 JWT가 있으면 Authorization 헤더에 자동으로 Bearer 토큰을 추가합니다.
 * - JSON 요청/응답을 기본으로 처리합니다.
 */
export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // localStorage에 저장된 토큰이 있으면 자동 첨부
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content 등 body 없는 응답
  if (response.status === 204) {
    return { ok: true, status: 204, data: null };
  }

  const data = await response.json();

  if (!response.ok) {
    // BE 공통 에러 형식: { error: { code, message } }
    const errorMessage =
      data?.error?.message || `요청에 실패했습니다 (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.code = data?.error?.code || "UNKNOWN";
    throw error;
  }

  return { ok: true, status: response.status, data };
}

/* ─── 편의 메서드 ─── */

export function apiGet(path, options = {}) {
  return apiFetch(path, { ...options, method: "GET" });
}

export function apiPost(path, body, options = {}) {
  return apiFetch(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPatch(path, body, options = {}) {
  return apiFetch(path, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function apiDelete(path, options = {}) {
  return apiFetch(path, { ...options, method: "DELETE" });
}
