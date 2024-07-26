import LocationCoords from "@/src/components/location-coords"
import { useLocalSearchParams } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"

export default function GetCoords() {
  const { bus_id } = useLocalSearchParams()
  return (
    <View style={styles.container}>
      <LocationCoords busId={bus_id as string} />
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
