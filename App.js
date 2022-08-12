import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  let cameraRef = useRef();
  const [CameraPermission, setCameraPermission] = useState();
  const [MediaLPermission, setMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setCameraPermission(cameraPermission.status === "granted");
      setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (CameraPermission === undefined) {
    return <Text>Allow permission to gain access to the Camera.</Text>
  } else if (!CameraPermission) {
    return <Text>Ypu didn't allow permission to gain camera access. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1, base64: true, exif: false
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
        alert('Image saved, take another')
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        {MediaLPermission ? <Button title="Save" onPress={savePhoto} color='green' /> : undefined}
        <Button title="Share" onPress={sharePic} color='gray' />
        <Button title="Discard" onPress={() => setPhoto(undefined)} color='red' />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.btncontainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btncontainer: {
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  preview: {
    flex: 1,
    alignSelf: 'stretch',
  }
});
