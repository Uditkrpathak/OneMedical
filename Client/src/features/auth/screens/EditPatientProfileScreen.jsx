import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { updateProfile } from '../authSlice';
import userApi from '../userApi';

export default function EditPatientProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'Other');

  const [height, setHeight] = useState(user?.height ? String(user.height) : '170');
  const [weight, setWeight] = useState(user?.weight ? String(user.weight) : '65');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+ Positive');

  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(user?.emergencyContact?.relationship || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name,
        email,
        heightCm: Number(height),
        weightKg: Number(weight),
        bloodGroup,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelation,
          phone: emergencyPhone,
        },
      };

      await userApi.updatePatientProfile(token, payload);
      dispatch(updateProfile({ 
        name, 
        email, 
        phoneNumber: phone || user?.phoneNumber, 
        height: Number(height), 
        weight: Number(weight), 
        bloodGroup, 
        emergencyContact: { name: emergencyName, relationship: emergencyRelation, phone: emergencyPhone }, 
        isProfileCompleted: true 
      }));
      setSaving(false);

      Alert.alert('Profile Saved', 'Your profile updates have been saved to MongoDB.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setSaving(false);
      Alert.alert('Error', err.message || 'Failed to save profile updates.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerShareBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* AVATAR CHANGE ROW */}
        <View style={styles.avatarChangeWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }}
            style={styles.avatarImage}
          />
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* PERSONAL INFORMATION SECTION */}
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.phoneLabelRow}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TouchableOpacity><Text style={styles.changeLinkText}>Change</Text></TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} />

          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderPillsRow}>
            {['Female', 'Male', 'Other'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.genderPill, gender === item && styles.genderPillActive]}
                onPress={() => setGender(item)}
              >
                <Text style={[styles.genderPillText, gender === item && styles.genderPillTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BODY INFORMATION SECTION */}
        <Text style={styles.sectionTitle}>BODY INFORMATION</Text>
        <View style={styles.card}>
          <View style={styles.twoColRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Blood Group</Text>
          <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />
        </View>

        {/* EMERGENCY CONTACT SECTION */}
        <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Contact Name</Text>
          <TextInput style={styles.input} value={emergencyName} onChangeText={setEmergencyName} />

          <Text style={styles.inputLabel}>Relationship</Text>
          <TextInput style={styles.input} value={emergencyRelation} onChangeText={setEmergencyRelation} />

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* SAVE CTA */}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile Changes</Text>
          )}
        </TouchableOpacity>

        {/* DELETE HEALTH PROFILE */}
        <TouchableOpacity
          style={styles.deleteLinkBtn}
          onPress={() =>
            Alert.alert('Delete Health Profile', 'Are you sure you want to request deletion of your health records?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' },
            ])
          }
        >
          <Text style={styles.deleteLinkText}>Delete My Health Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBackBtn: {
    paddingRight: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerShareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  avatarChangeWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  changePhotoBtn: {},
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 14,
  },
  phoneLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003D9B',
  },
  genderPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  genderPillActive: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  genderPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  genderPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  twoColRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#003D9B',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  deleteLinkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
});
