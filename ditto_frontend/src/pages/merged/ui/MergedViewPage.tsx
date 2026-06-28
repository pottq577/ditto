import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

interface Sticker {
  id: number;
  imageUrl: string;
  userId: number;
}

export const MergedViewPage = ({ onBack }: { onBack: () => void }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStickers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/stickers/couple/1');
      if (response.ok) {
        const data = await response.json();
        setStickers(data);
      }
    } catch (error) {
      console.error('스티커 조회 실패:', error);
    } finally {
      setLoading(false);
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

  // 더미로 위/아래 렌더링. A유저 스티커는 상단, B유저 스티커는 하단으로 배치.
  // 실제 로직은 userId에 따라 분기. MVP에서는 그냥 배열 순서대로 출력.
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
            <Image
              key={s.id}
              source={{ uri: s.imageUrl }}
              style={[styles.sticker, { zIndex: index, top: index * 200 }]} // MVP: 단순 위아래 배치
              resizeMode="contain"
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBtn: {
    color: '#4A90E2',
    fontSize: 16,
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    marginTop: 50,
  },
  emptyText: {
    color: '#aaa',
    marginTop: 100,
  },
  sticker: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
});
