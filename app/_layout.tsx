import { Stack } from "expo-router";
import '../global.css';
import { NoteProvider } from "../context/NoteContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NoteProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NoteProvider>
    </GestureHandlerRootView>
  );
}
