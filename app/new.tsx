import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useNotes } from "../context/NoteContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { addNote } = useNotes();
  const router = useRouter();

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Cannot save", "Please enter a title or content for your note");
      return;
    }

    addNote(title, content);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between pt-16 px-4 pb-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={handleSave}
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4">
        <TextInput
          className="text-2xl font-bold mb-4"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <TextInput
          className="text-lg flex-1"
          placeholder="Start typing..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
