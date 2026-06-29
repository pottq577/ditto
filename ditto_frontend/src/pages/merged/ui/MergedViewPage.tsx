import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  Alert,
  ListRenderItem,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Logger } from "@/shared/lib/logger";
import { createStyles } from "./MergedViewPage.styles";
import { API_BASE_URL } from "@/shared/api/api";
import { useAuth } from "@/shared/lib/AuthContext";
import { useTheme } from "@/shared/theme/theme";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";

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
  const { userId, coupleId } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [reactions, setReactions] = useState<Record<number, Reaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStickerId, setActiveStickerId] = useState<number | null>(null);
  const [reactionText, setReactionText] = useState("");

  const fetchStickers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/stickers/couple/${coupleId || 1}`,
        {
          headers: { "X-User-Id": userId || "1" },
        },
      );
      if (response.ok) {
        const data: Sticker[] = await response.json();
        setStickers(data);

        // N+1 문제 완화를 위한 Promise.all 및 Batched update
        const reactionsData = await Promise.all(
          data.map(async (s) => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/api/v1/reactions/sticker/${s.id}`,
                {
                  headers: { "X-User-Id": userId || "1" },
                },
              );
              if (res.ok) {
                return { id: s.id, data: await res.json() };
              }
            } catch (e) {
              Logger.error(`리액션 조회 실패 (sticker: ${s.id})`, e);
            }
            return null;
          }),
        );

        const newReactions: Record<number, Reaction[]> = {};
        reactionsData.forEach((result) => {
          if (result) newReactions[result.id] = result.data;
        });
        setReactions((prev) => ({ ...prev, ...newReactions }));
      } else {
        Alert.alert("조회 실패", "스티커를 불러오지 못했어요.");
      }
    } catch (error) {
      Logger.error("스티커 조회 실패:", error);
      Alert.alert("네트워크 문제", "인터넷 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReaction = async (stickerId: number) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/reactions/sticker/${stickerId}`,
        {
          headers: { "X-User-Id": userId || "1" },
        },
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
    if (!activeStickerId || !reactionText || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId || "1",
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
        Alert.alert("전송 실패", "글을 남기지 못했어요.");
      }
    } catch (e) {
      Logger.error("리액션 전송 실패", e);
      Alert.alert("네트워크 문제", "인터넷 연결을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  const renderItem: ListRenderItem<Sticker> = useCallback(
    ({ item: s, index }) => {
      // Signature: 아날로그 느낌을 위한 약간의 랜덤 회전율
      const rotation = -3 + (index % 7);

      return (
        <Animated.View
          entering={FadeInUp.delay(index * 100)
            .springify()
            .damping(15)}
        >
          <AnimatedButton
            style={[
              styles.stickerWrapper,
              { transform: [{ rotate: `${rotation}deg` }] },
            ]}
            onPress={() => setActiveStickerId(s.id)}
          >
            <Image
              source={{
                uri: s.imageUrl.startsWith("/")
                  ? `${API_BASE_URL}${s.imageUrl}`
                  : s.imageUrl,
              }}
              style={styles.stickerImage}
              resizeMode="cover"
            />
            {reactions[s.id]?.map((r, rIdx) => (
              <View
                key={r.id}
                style={[
                  styles.bubble,
                  {
                    right: -40,
                    top: rIdx * 45,
                    transform: [
                      { rotate: `${-rotation + ((rIdx % 3) - 1)}deg` },
                    ], // 말풍선도 약간 삐뚤게
                  },
                ]}
              >
                <Text style={styles.bubbleText}>{r.content}</Text>
              </View>
            ))}
          </AnimatedButton>
        </Animated.View>
      );
    },
    [reactions, styles],
  );

  const ListEmptyComponent = () => (
    <Text style={styles.emptyText}>
      아직 오늘 빈 페이지예요. 일상을 남겨보세요.
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedButton
          onPress={onBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          static
        >
          <Text style={styles.headerBtn}>오늘 담기</Text>
        </AnimatedButton>
        <Text style={styles.headerTitle}>우리의 오늘</Text>
        <AnimatedButton
          onPress={fetchStickers}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          static
        >
          <Text style={styles.headerBtn}>조각 모으기</Text>
        </AnimatedButton>
      </View>

      <View style={styles.canvas}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 100 }}
          />
        ) : (
          <FlatList
            data={stickers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {activeStickerId && (
        <View style={styles.reactionInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이 순간에 남길 말..."
            placeholderTextColor={colors.textMuted}
            value={reactionText}
            onChangeText={setReactionText}
            editable={!isSubmitting}
            autoFocus
          />
          <Button
            title={isSubmitting ? "붙이는 중..." : "남기기"}
            onPress={submitReaction}
            color={colors.primary}
            disabled={isSubmitting || !reactionText.trim()}
          />
          <Button
            title="닫기"
            onPress={() => setActiveStickerId(null)}
            color={colors.textMuted}
            disabled={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};
