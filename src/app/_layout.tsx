import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Link, Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"

import { Colors } from "@/src/constants/Colors"
import { useColorScheme } from "@/src/hooks/useColorScheme"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Pressable } from "react-native"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Bus tracker",
            // headerRight: () => (
            //   <Link href="/map" asChild>
            //     <Pressable>
            //       {({ pressed }) => (
            //         <FontAwesome
            //           name="map"
            //           size={25}
            //           color={Colors.dark.text}
            //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //         />
            //       )}
            //     </Pressable>
            //   </Link>
            // ),
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            headerTitle: "Map",
            headerRight: () => (
              <Link href="/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="home"
                      size={25}
                      color={Colors.dark.text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="coords"
          options={{
            headerTitle: "Your co-ordinates",
            headerRight: () => (
              <Link href="/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="home"
                      size={25}
                      color={Colors.dark.text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
