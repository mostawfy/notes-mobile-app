import React, { useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNotes } from "../context/NoteContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
  const { notes, isLoading, reorderNotes, deleteNotes } = useNotes();
  const router = useRouter();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelection = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]);
  };

  const deleteSelectedNotes = () => {
    Alert.alert(
      "Delete Notes",
      `Are you sure you want to delete ${selectedNotes.length} note(s)?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteNotes(selectedNotes);
            setSelectedNotes([]);
            setIsSelectionMode(false);
          }
        }
      ]
    );
  };



  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-500 text-lg text-center mb-2">
        No notes yet
      </Text>
      <Text className="text-gray-400 text-center">
        Tap the + button to create your first note
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading notes...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        <View className="pt-16 pb-4 px-4 border-b border-gray-200 flex-row justify-between items-center">
          <Text className="text-3xl font-bold">Notes</Text>
          {
            notes.length > 0 && (
              <View className="flex-row">
              {isSelectionMode ? (
                <>
                  <TouchableOpacity 
                    className="mr-4"
                    onPress={toggleSelectionMode}
                  >
                    <Text className="text-blue-500">Cancel</Text>
                  </TouchableOpacity>
                  {selectedNotes.length > 0 && (
                    <TouchableOpacity 
                      onPress={deleteSelectedNotes}
                    >
                      <Text className="text-red-500">Delete</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity onPress={toggleSelectionMode}>
                  <Text className="text-blue-500">Select</Text>
                </TouchableOpacity>
              )}
            </View>
            )
          }
        </View>

        <DraggableFlatList
          data={notes}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => reorderNotes(data)}
          renderItem={({ item, drag, isActive }) => (
            <ScaleDecorator>
              <TouchableOpacity
                className={`p-4 border-b border-gray-100 ${
                  isActive ? "bg-gray-100" : ""
                } ${selectedNotes.includes(item.id) ? "bg-blue-50" : ""}`}
                onLongPress={isSelectionMode ? undefined : drag}
                onPress={() => {
                  if (isSelectionMode) {
                    toggleSelection(item.id);
                  } else {
                    router.push(`/note/${item.id}`);
                  }
                }}
                disabled={isActive}
              >
                <View className="flex-row items-center gap-4">
                  {isSelectionMode ? (
                    <Ionicons 
                      name={selectedNotes.includes(item.id) ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={selectedNotes.includes(item.id) ? "#3b82f6" : "#999"} 
                    />
                  ) : (
                    <Ionicons name="reorder-three" size={24} color="#999" />
                  )}
                  <View className="flex-1">
                    <Text
                      className="text-lg font-semibold mb-1"
                      numberOfLines={1}
                    >
                      {item.title || "Untitled Note"}
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500" numberOfLines={1}>
                        {item.content.substring(0, 40)}
                        {item.content.length > 40 ? "..." : ""}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </ScaleDecorator>
          )}
          ListEmptyComponent={renderEmptyList}
          scrollEnabled={!isSelectionMode}
        />

        {!isSelectionMode && (
          <TouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
            onPress={() => router.push("/new")}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
