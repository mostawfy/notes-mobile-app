import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import { useNotes } from "../../context/NoteContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote, deleteNote, isLoading } = useNotes();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(true);

  useEffect(() => {
    const loadNote = () => {
      setIsNoteLoading(true);
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setIsNoteLoading(false);
      } else {
        Alert.alert("Error", "Note not found");
        router.back();
      }
    };

    if (!isLoading) {
      loadNote();
    }
  }, [id, isLoading]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Cannot save", "Please enter a title or content for your note");
      return;
    }

    updateNote(id, title, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteNote(id);
            router.back();
          }
        }
      ]
    );
  };

  if (isLoading || isNoteLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading note...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between pt-16 px-4 pb-2 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View className="flex-row">
          {isEditing ? (
            <TouchableOpacity 
              className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
              onPress={handleSave}
            >
              <Text className="text-white font-medium">Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="bg-gray-100 px-4 py-2 rounded-lg mr-2"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-gray-800 font-medium">Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            className="bg-red-100 px-4 py-2 rounded-lg"
            onPress={handleDelete}
          >
            <Text className="text-red-600 font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 p-4">
        {isEditing ? (
          <>
            <TextInput
              className="text-2xl font-bold mb-4"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="text-lg flex-1"
              placeholder="Start typing..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold mb-4">
              {title || "Untitled Note"}
            </Text>
            <Text className="text-lg">
              {content || "No content"}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
