import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Share,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { colors, spacing, radius, typography } from "@/theme/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  roomCode: string;
};

export function ShareBottomSheet({ visible, onClose, roomCode }: Props) {
  const insets = useSafeAreaInsets();
  const viewerBase =
    process.env.EXPO_PUBLIC_VIEWER_URL ?? "https://sapo-counter.web.app";
  const url = `${viewerBase}/${roomCode}`;
  const displayUrl = url.replace(/^https?:\/\//, "");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await Clipboard.setStringAsync(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function shareWhatsApp() {
    const text = `Seguí la partida en vivo: ${url}`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}`).catch(
      () => {},
    );
  }

  function shareGeneric() {
    Share.share({ message: `Seguí la partida en vivo: ${url}` }).catch(() => {});
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
          onPress={() => {}}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Compartir en vivo</Text>
          <Text style={styles.subtitle}>
            Los espectadores ven los puntajes en tiempo real
          </Text>

          <View style={styles.qrBox}>
            <View style={styles.qrInner}>
              <QRCode
                value={url}
                size={160}
                backgroundColor="white"
                color={colors.textPrimary}
              />
            </View>
          </View>

          <View style={styles.codeRow}>
            <Text style={styles.code}>{roomCode}</Text>
            <TouchableOpacity onPress={copyCode} hitSlop={8}>
              <Feather name="copy" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.url, copied && styles.copied]}>
            {copied ? "¡Copiado!" : displayUrl}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={shareWhatsApp}>
              <MaterialCommunityIcons
                name="whatsapp"
                size={18}
                color="#25D366"
              />
              <Text style={styles.actionLabel}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={shareGeneric}>
              <Feather name="share" size={18} color={colors.textSecondary} />
              <Text style={styles.actionLabel}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: { fontSize: 18, fontWeight: "600", color: colors.textPrimary },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  qrBox: {
    width: 192,
    height: 192,
    borderRadius: 16,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xl,
  },
  qrInner: {
    backgroundColor: "white",
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  code: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  url: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  copied: { color: colors.accent, fontWeight: "600" },
  actions: {
    flexDirection: "row",
    gap: spacing.sm + 2,
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  actionLabel: { ...typography.bodyMedium, color: colors.textPrimary },
});
