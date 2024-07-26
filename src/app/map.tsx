import { Colors } from "@/src/constants/Colors"
import { supabase } from "@/src/utils/supabase"
import { Bus } from "@/src/utils/types"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import MapView from "react-native-maps"

export default function MapScreen() {
  const [location, setLocation] = useState<Bus | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { bus_id } = useLocalSearchParams()

  const BUS_ID = bus_id

  useEffect(() => {
    // Fetch the inital data
    ;(async () => {
      try {
        const loc = await supabase.from("bus").select("*").eq("bus_id", BUS_ID)
        console.log(loc?.data![0])
        if (loc.data) {
          setLocation(loc.data[0])
        }
      } catch (error) {
        console.error(error)
      }
    })()

    // Subscribe to the changes
    const channels = supabase
      .channel("bus-location-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bus",
          filter: `bus_id=eq.${BUS_ID}`,
        },
        (payload) => {
          console.log("Change received!", payload)
          setLocation({
            id: payload.new.id,
            bus_id: payload.new.bus_id,
            latitude: payload.new.latitude,
            longitude: payload.new.longitude,
            updated_at: payload.new.updated_at,
            created_at: payload.new.created_at,
          })
        }
      )
      .subscribe()
    console.log(channels)

    return () => {
      channels.unsubscribe()
    }
  }, [])
  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            onUserLocationChange={async (e) => {
              setSpeed(e.nativeEvent.coordinate!.speed || 0)
              await supabase
                .from("bus")
                .update({
                  speed: e.nativeEvent.coordinate!.speed || 0,
                })
                .eq("bus_id", BUS_ID)
            }}
            showsMyLocationButton={false}
          />
          <View style={styles.speedText}>
            <Text>{speed?.toFixed(2)}</Text>
            <Text>kmph</Text>
          </View>
        </>
      ) : (
        <Text>
          <FontAwesome
            name="spinner"
            size={25}
            color={Colors.light.text}
            style={styles.spinner}
          />
        </Text>
      )}
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
  map: {
    width: "100%",
    height: "100%",
  },
  spinner: {},
  speedText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 1000,
  },
})
