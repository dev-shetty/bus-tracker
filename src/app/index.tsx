import LocationCoords from "@components/location-coords"
import { Colors } from "@constants/Colors"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Link, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Pressable, StyleSheet, View } from "react-native"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* <Stack.Screen /> */}
      {/* <LocationCoords /> */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
