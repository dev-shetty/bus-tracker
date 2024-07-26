import { Colors } from "@/src/constants/Colors"
import { supabase } from "@/src/utils/supabase"
import { Bus } from "@/src/utils/types"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import MapView from "react-native-maps"

export default function MapScreen() {
  const [location, setLocation] = useState<Bus | null>(null)

  const BUS_ID = "BUS-001"

  useEffect(() => {
    // Fetch the inital data
    ;(async () => {
      const loc = await supabase.from("bus").select("*").eq("bus_id", BUS_ID)
      console.log(loc?.data![0])
      if (loc.data) {
        setLocation(loc.data[0])
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
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        />
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
})
