import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import axios from "axios";
import { api, ensureGuestAuth } from './lib/api';
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const API = '/api/buckts';
  const [buckets, setBuckets] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = "http://localhost:3000/api/buckets";

  // ✅ 사용자 정보 로컬스토리지에서 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ 사용자 선택 시 로컬스토리지에 저장
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  // ✅ 전체 데이터 불러오기
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setBuckets(data))
      .catch((err) => console.error("데이터 불러오기 실패:", err));
  }, []);

  const onCreate = (text) => {
    if (!selectedUser) return;

    const newBucket = {
      name: selectedUser.name,
      goal: text,
      text,
      uid: selectedUser.uid,
      isCompleted: false,
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBucket),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.uid) data.uid = selectedUser.uid;
        setBuckets((prev) => [data, ...prev]);
      })
      .catch((err) => console.error("버킷 생성 실패:", err));
  };

  const onDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setBuckets((prev) => prev.filter((t) => t._id !== id)))
      .catch((err) => console.error("삭제 실패:", err));
  };

  const onUpdate = (id, newText) => {
    fetch(`${API_URL}/${id}/text`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Update response:", data);
        if (data.bucket && data.bucket._id) {
          setBuckets((prev) => {
            const updatedBuckets = prev.map((t) =>
              t._id === data.bucket._id ? data.bucket : t
            );
            console.log("Updated buckets:", updatedBuckets);
            return updatedBuckets;
          });
        } else {
          console.warn("Unexpected response format, fetching updated data...");
          fetch(API_URL)
            .then((res) => res.json())
            .then((updatedBuckets) => {
              console.log("Refreshed buckets:", updatedBuckets);
              setBuckets(updatedBuckets);
            })
            .catch((err) => console.error("Failed to refresh buckets:", err));
        }
      })
      .catch((err) => {
        console.error("수정 실패:", err);
        alert("수정에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const filteredBuckets = selectedUser
    ? buckets.filter((t) => t.uid === selectedUser.uid)
    : [];
  console.log("Filtered buckets:", filteredBuckets); // 필터링된 데이터 확인

  return (
    <div className="App">
      <Header
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleUserSelect}
      />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList
          buckets={filteredBuckets}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </main>
    </div>
  );
}

export default App;