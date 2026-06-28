import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
  Alert,
  ListRenderItem,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStickerId, setActiveStickerId] = useState<number | null>(null);
  const [reactionText, setReactionText] = useState("");

  const fetchStickers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/stickers/couple/1`);
      if (response.ok) {
        const data: Sticker[] = await response.json();
        setStickers(data);

        // N+1 문제 완화를 위한 Promise.all 및 Batched update
        const reactionsData = await Promise.all(
          data.map(async (s) => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/v1/reactions/sticker/${s.id}`);
              if (res.ok) {
                return { id: s.id, data: await res.json() };
              }
            } catch (e) {
              Logger.error(`리액션 조회 실패 (sticker: ${s.id})`, e);
            }
            return null;
          })
        );
        
        const newReactions: Record<number, Reaction[]> = {};
        reactionsData.forEach((result) => {
          if (result) newReactions[result.id] = result.data;
        });
        setReactions((prev) => ({ ...prev, ...newReactions }));
      } else {
        Alert.alert("조회 실패", "스티커 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      Logger.error("스티커 조회 실패:", error);
      Alert.alert("네트워크 오류", "서버와 통신할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReaction = async (stickerId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reactions/sticker/${stickerId}`);
      if (res.ok) {
        const rData = await res.json();
        setReactions((prev) => ({ ...prev, [stickerId]: rData }));
      }
    } catch (error) {
      Logger.error("리액션 조회 실패:", error);
    }
  };

  const submitReaction = async () => {
    if (!activeStickerId || !reactionText || isSubmitting) return;
    setIsSubmitting(true);
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
        const submittedId = activeStickerId;
        setActiveStickerId(null);
        fetchSingleReaction(submittedId);
      } else {
        Alert.alert("전송 실패", "리액션을 남기지 못했습니다.");
      }
    } catch (e) {
      Logger.error("리액션 전송 실패", e);
      Alert.alert("네트워크 오류", "서버와 통신할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  const renderItem: ListRenderItem<Sticker> = useCallback(({ item: s }) => {
    return (
      <TouchableOpacity
        style={styles.stickerWrapper}
        onPress={() => setActiveStickerId(s.id)}
      >
        <Image
          source={{ uri: s.imageUrl }}
          style={styles.stickerImage}
          resizeMode="contain"
        />
        {reactions[s.id]?.map((r, rIdx) => (
          <View
            key={r.id}
            style={[styles.bubble, { right: -50, top: rIdx * 40 }]}
          >
            <Text style={styles.bubbleText}>{r.content}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  }, [reactions]);

  const ListEmptyComponent = () => (
    <Text style={styles.emptyText}>아직 업로드된 스티커가 없습니다.</Text>
  );

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
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 100 }} />
        ) : (
          <FlatList
            data={stickers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {activeStickerId && (
        <View style={styles.reactionInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="말풍선 입력..."
            placeholderTextColor="#ccc"
            value={reactionText}
            onChangeText={setReactionText}
            editable={!isSubmitting}
          />
          <Button 
            title={isSubmitting ? "전송중..." : "작성"} 
            onPress={submitReaction} 
            color="#4A90E2" 
            disabled={isSubmitting} 
          />
          <Button
            title="취소"
            onPress={() => setActiveStickerId(null)}
            color="#999"
            disabled={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};
