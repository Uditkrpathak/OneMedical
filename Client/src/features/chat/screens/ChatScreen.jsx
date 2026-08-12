import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../context/SocketContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../theme/colors';

const INITIAL_MESSAGES = [
  { id: '1', senderRole: 'therapist', text: 'Hello Alex! How is your right knee feeling after today’s Straight Leg Raise exercises?', timestamp: '10:15 AM' },
  { id: '2', senderRole: 'patient', text: 'Hi Dr. Sarah, quadriceps feel much stronger! Pain is around 2/10.', timestamp: '10:18 AM' },
  { id: '3', senderRole: 'therapist', text: 'Excellent progress. Keep applying ice for 15 mins post session.', timestamp: '10:20 AM' },
];

export default function ChatScreen({ route, navigation }) {
  const { user } = useSelector((state) => state.auth);
  const socket = useSocket();
  const recipientName = route?.params?.recipientName || 'Dr. Sarah Jenkins';
  const recipientId = route?.params?.recipientId || 'therapist_1';

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          senderRole: data.senderRole,
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [socket]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: String(Date.now()),
      senderRole: user?.role || 'patient',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    if (socket) {
      socket.emit('send_message', {
        recipientId,
        text: inputText.trim(),
        messageId: newMsg.id,
      });
    }

    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderRole === (user?.role || 'patient');
    return (
      <View style={[styles.msgWrapper, isMe ? styles.myMsgWrapper : styles.theirMsgWrapper]}>
        <View style={[styles.msgBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>{item.text}</Text>
          <Text style={[styles.msgTime, isMe ? styles.myTimeText : styles.theirTimeText]}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>{recipientName}</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Active Telehealth Session</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.headerSettingsBtn}>
            <Ionicons name="settings-sharp" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type clinical inquiry or message..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && { backgroundColor: '#cbd5e1' }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={16} color="#ffffff" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  backBtn: {
    paddingRight: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22c55e', marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  headerSettingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: 16, paddingBottom: 20 },
  msgWrapper: { marginBottom: 14, flexDirection: 'row' },
  myMsgWrapper: { justifyContent: 'flex-end' },
  theirMsgWrapper: { justifyContent: 'flex-start' },
  msgBubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  myBubble: { backgroundColor: '#003D9B', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 21 },
  myMsgText: { color: '#ffffff', fontWeight: '500' },
  theirMsgText: { color: '#0f172a' },
  msgTime: { fontSize: 10, marginTop: 6, textAlign: 'right', fontWeight: '500' },
  myTimeText: { color: '#e6f0ff' },
  theirTimeText: { color: '#94a3b8' },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
