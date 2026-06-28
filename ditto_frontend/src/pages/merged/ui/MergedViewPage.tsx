import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { Logger } from "../../../shared/lib/logger";
import { styles } from "./MergedViewPage.styles";
import { API_BASE_URL } from "../../../shared/api/api";

interface Sticker {
  id: number;
  imageUrl: string;
  userId: number;
}

interface Reaction {
  id: number;
  stickerId: number;
  content: string;
}

export const MergedViewPage = ({ onBack }: { onBack: () => void }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [reactions, setReactions] = useState<Record<number, Reaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeStickerId, setActiveStickerId] = useState<number | null>(null);
  const [reactionText, setReactionText] = useState("");

  const fetchStickers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/stickers/couple/1`);
      if (response.ok) {
        const data: Sticker[] = await response.json();
        setStickers(data);

        // Fetch reactions for each sticker
        data.forEach((s) => fetchReactions(s.id));
      }
    } catch (error) {
      Logger.error("스티커 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReactions = async (stickerId: number) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/reactions/sticker/${stickerId}`,
      );
      if (res.ok) {
        const rData = await res.json();
        setReactions((prev) => ({ ...prev, [stickerId]: rData }));
      }
    } catch (error) {
      Logger.error("리액션 조회 실패:", error);
    }
  };

  const submitReaction = async () => {
    if (!activeStickerId || !reactionText) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "1",
        },
        body: JSON.stringify({
          stickerId: activeStickerId,
          content: reactionText,
        }),
      });
      if (response.ok) {
        setReactionText("");
        setActiveStickerId(null);
        fetchReactions(activeStickerId);
      }
    } catch (e) {
      Logger.error("리액션 전송 실패", e);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerBtn}>← 카메라</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오늘의 디토</Text>
        <TouchableOpacity onPress={fetchStickers}>
          <Text style={styles.headerBtn}>새로고침</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.canvas}>
        {stickers.length === 0 ? (
          <Text style={styles.emptyText}>아직 업로드된 스티커가 없습니다.</Text>
        ) : (
          stickers.map((s, index) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.stickerWrapper,
                { zIndex: index, top: index * 200 },
              ]}
              onPress={() => setActiveStickerId(s.id)}
            >
              <Image
                source={{ uri: s.imageUrl }}
                style={styles.stickerImage}
                resizeMode="contain"
              />
              {/* 말풍선 렌더링 */}
              {reactions[s.id]?.map((r, rIdx) => (
                <View
                  key={r.id}
                  style={[styles.bubble, { right: -50, top: rIdx * 40 }]}
                >
                  <Text style={styles.bubbleText}>{r.content}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 리액션 입력창 오버레이 */}
      {activeStickerId && (
        <View style={styles.reactionInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="말풍선 입력..."
            placeholderTextColor="#ccc"
            value={reactionText}
            onChangeText={setReactionText}
          />
          <Button title="작성" onPress={submitReaction} color="#4A90E2" />
          <Button
            title="취소"
            onPress={() => setActiveStickerId(null)}
            color="#999"
          />
        </View>
      )}
    </View>
  );
};
