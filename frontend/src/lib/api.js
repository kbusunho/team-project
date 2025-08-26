import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ 환경 변수 사용 (배포 시 Cloudtype URL)
  withCredentials: true,                 // ✅ 쿠키 포함 (크로스 도메인)
});

// 401이면 게스트 로그인 시도 후 재시도
let isAuthing = false;
api.interceptors.response.use(
  r => r,
  async (err) => {
    if (err?.response?.status === 401 && !isAuthing) {
      try {
        isAuthing = true;
        await ensureGuestAuth();
        isAuthing = false;
        return api.request(err.config);
      } catch (e) {
        isAuthing = false;
        console.error("Guest auth retry failed:", e.message); // ✅ 디버깅용 로그
      }
    }
    return Promise.reject(err);
  }
);

export async function ensureGuestAuth() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = (crypto?.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
    localStorage.setItem('deviceId', deviceId);
  }
  try {
    console.log('Attempting guest auth with deviceId:', deviceId); // ✅ 디버깅용 로그
    await api.post('/api/auth/guest', { deviceId });
  } catch (err) {
    console.error("Guest auth failed:", err.response ? err.response.data : err.message);
    throw err;
  }
}