import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function JobsScreen() {
  const router = useRouter();

  return (
    <View>
      <Button title="Ir a Detalle" onPress={() => router.push("/detail/123")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
