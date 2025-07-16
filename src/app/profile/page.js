'use client'
import React, { useState, useEffect } from 'react';
import MainLayout from "../components/mainLayout";
import { Camera, Save, Loader, Edit2, X } from 'lucide-react';
import { auth, storage, db } from '@/lib/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();
  const cookies = new Cookies();
  
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    email: '',
    profileImage: '',
    coverImage: '',
    notifications: true,
    darkMode: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const [imageLoading, setImageLoading] = useState({
    profile: false,
    cover: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isSignedIn = cookies.get("signedIn");
      if (!isSignedIn) {
        router.push('/signin');
        return;
      }
      await fetchUserData();
    };

    checkAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', content: 'Please login to view profile' });
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          username: data.username || user.displayName || '',
          bio: data.bio || '',
          email: user.email || '',
          profileImage: data.profileImage || user.photoURL || '',
          coverImage: data.coverImage || '',
          notifications: data.notifications !== undefined ? data.notifications : true,
          darkMode: data.darkMode !== undefined ? data.darkMode : true,
          emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
          pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : true
        });
      } else {
        // Create initial user document if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          username: user.displayName || '',
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', content: 'Error loading user data' });
    }
  };

  const handleImageUpload = async (event, type) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', content: 'Please login to upload images' });
        return;
      }

      setImageLoading({ ...imageLoading, [type]: true });

      // Create a reference to the file in Firebase Storage
      const imageRef = ref(storage, `users/${user.uid}/${type}/${file.name}`);
      
      // Upload file
      await uploadBytes(imageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Update user data
      const updates = { [type === 'profile' ? 'profileImage' : 'coverImage']: downloadURL };
      await updateDoc(doc(db, 'users', user.uid), updates);

      // Update local state
      setUserData(prev => ({ ...prev, ...updates }));

      // Update profile photo in Firebase Auth if it's a profile image
      if (type === 'profile') {
        await updateProfile(user, { photoURL: downloadURL });
      }

      setMessage({ type: 'success', content: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', content: 'Error uploading image' });
    } finally {
      setImageLoading({ ...imageLoading, [type]: false });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', content: 'Please login to save changes' });
        return;
      }

      await updateProfile(user, { displayName: userData.username });
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage({ type: 'success', content: 'Changes saved successfully' });
      setIsEditing(false);  // Exit edit mode after saving
    } catch (error) {
      console.error('Error saving changes:', error);
      setMessage({ type: 'error', content: 'Error saving changes' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <MainLayout>
      <div className="min-h-[100vh] bg-gray-950">
        {/* Background Container */}
        <div className="h-[200px] bg-gray-900 relative">
          {userData.coverImage && (
            <img 
              src={userData.coverImage} 
              alt="cover" 
              className="w-full h-full object-cover"
            />
          )}
          {isEditing && (
            <label className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-800 shadow-lg cursor-pointer hover:bg-gray-700">
              {imageLoading.cover ? (
                <Loader className="w-5 h-5 animate-spin text-gray-300" />
              ) : (
                <Camera className="w-5 h-5 text-gray-300" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'cover')}
              />
            </label>
          )}
        </div>

        {/* Profile Content Container */}
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Profile Image */}
          <div className="absolute -top-24 left-4">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-gray-950 bg-gray-900 overflow-hidden">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-800 shadow-lg cursor-pointer hover:bg-gray-700">
                  {imageLoading.profile ? (
                    <Loader className="w-4 h-4 animate-spin text-gray-300" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-300" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="pt-20 pb-8">
            {/* Edit Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-800 text-gray-300"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Edit profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    className="text-2xl font-semibold w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-white">
                    {userData.username || "Your Name"}
                  </h1>
                )}
                <p className="text-gray-400 mt-1">{userData.email}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-white mb-2">About</h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] text-white"
                    placeholder="Write something about yourself..."
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {userData.bio || "No bio added yet."}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="space-y-4 border-t border-gray-800 pt-6">
                  <h2 className="text-lg font-medium text-white mb-4">Settings</h2>
                  {[
                    {
                      name: 'emailNotifications',
                      title: 'Email Notifications',
                      description: 'Receive email updates and reminders'
                    },
                    {
                      name: 'pushNotifications',
                      title: 'Push Notifications',
                      description: 'Receive push notifications'
                    },
                    {
                      name: 'darkMode',
                      title: 'Dark Mode',
                      description: 'Toggle dark/light theme'
                    }
                  ].map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between py-2">
                      <div>
                        <h3 className="text-white font-medium">{setting.title}</h3>
                        <p className="text-sm text-gray-400">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => handleInputChange({
                          target: {
                            name: setting.name,
                            type: 'checkbox',
                            checked: !userData[setting.name]
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userData[setting.name] ? 'bg-blue-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userData[setting.name] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Save Button */}
              {isEditing && (
                <div className="pt-6">
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Save changes'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message.content && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {message.content}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;