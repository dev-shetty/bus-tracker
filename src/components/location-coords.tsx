import { supabase } from "@/src/utils/supabase"
import * as Location from "expo-location"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import MapView from "react-native-maps"

export default function LocationCoords() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const BUS_ID = "BUS-001"
  const LOCATION_TIMER = 5000

  useEffect(() => {
    let locationInterval: NodeJS.Timeout
    ;(async () => {
      const permission = await Location.requestForegroundPermissionsAsync()
      if (permission.status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      } else {
        setErrorMsg("")
      }

      locationInterval = setInterval(async () => {
        try {
          let loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          })

          setLocation(loc)
          const locationDetails = {
            bus_id: BUS_ID,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            updated_at: new Date(),
          }

          // Only update if the location changes
          if (
            loc.coords.longitude !== location?.coords.longitude ||
            loc.coords.latitude !== location?.coords.latitude
          ) {
            await supabase.from("bus").upsert(locationDetails, {
              onConflict: "bus_id",
            })
          }
          // console.warn(loc)
        } catch (error) {
          console.log(error)
        }
      }, LOCATION_TIMER)
    })()

    return () => {
      clearInterval(locationInterval)
    }
  }, [])

  let text = "Waiting.."
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text style={styles.paragraph}>{location?.coords.latitude}</Text>
          <Text style={styles.paragraph}>{location?.coords.longitude}</Text>
        </>
      ) : (
        <Text>Waiting...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: "100%",
    aspectRatio: 1,
  },
})
