import Button from "@/src/components/ui/button"
import { BUSES } from "@/src/constants"
import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"

export default function BusDetails() {
  const [open, setOpen] = useState(false)
  const [selectedBusId, setSelectedBusId] = useState(BUSES[0])
  const [items, setItems] = useState([
    { label: "Bus 1", value: "BUS-001" },
    { label: "Bus 2", value: "BUS-002" },
    { label: "Bus 3", value: "BUS-003" },
  ])

  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text>Select Bus No.</Text>
      <DropDownPicker
        open={open}
        value={selectedBusId}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedBusId}
        setItems={setItems}
      />
      <View>
        <Button
          text="Child"
          onPress={() => {
            router.navigate(`/coords?bus_id=${selectedBusId}`)
          }}
        />
        <Button
          text="Parent"
          style={styles.button}
          onPress={() => {
            router.navigate(`map?bus_id=${selectedBusId}`)
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "black",
  },
})
