import 'react-native-gesture-handler';
import React,{useState,useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  Axios  from 'axios';
import mime from 'mime'

const Stack = createNativeStackNavigator();

export default App = () => {
return (
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen component={Main} name="Main"/>
    <Stack.Screen component={Home} name="Home"/>
  </Stack.Navigator>
</NavigationContainer>

)
}

const Main=({navigation}) =>{

  const [val, setVal] = useState('');
  const [image, setImage] = useState(null);

  const check = (navigation) => {
    if(image && val!==1){
      var formData = new FormData();
      const newImageUri =  "file:///" + image.uri.split("file:/").join("");
      formData.append("file", {
        uri : newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop()
       });
      formData.append("season",val);
      console.log(formData);
      Axios.post("http://luars.herokuapp.com/image",formData)
      .then(res=>{
        console.log(res.data.output);
        navigation.navigate("Home",{output: res.data.output,image: image.uri})
      }).catch(err=>{
        console.log(err);
      })
    }
    else{
      alert('Please select document or season!')
    }
  }


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
      console.log(result);
      alert('Image is uploaded');
    }
  };
  return (
    <View style={styles.container}>
        <Text style={styles.mainTitle}>LuARS</Text>
      <View style={styles.inputView}>
        <Picker
          selectedValue={val}
          onValueChange={(itemValue,itemIndex) => setVal(itemValue)}>
          <Picker.Item label="Select Season" value={1} />
          <Picker.Item label="Growing" value="Growing" />
          <Picker.Item label="Harvesting" value="Harvesting" />
          {/* <Picker.Item label="Season3" value={4} /> */}
        </Picker>
      </View>
      
      <TouchableOpacity style={styles.loginBtn} onPress={pickImage}>
        <Text style={styles.loginText}>SELECT DOCUMENT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}
        onPress={()=>check(navigation)}
       >
        <Text style={styles.loginText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const Home = (props) =>{
  console.log(props.route.params);
  return(
  <View style={{flex:1,flexDirection:'column',alignItems:'center',backgroundColor:'#003f5c'}}>
    <Text style={styles.resultTitle}>Result</Text>
      {props.route.params.image && <Image source={{ uri: props.route.params.image }} style={{ width: '80%', height: 300,marginTop:50,borderWidth:10,borderColor:'white',borderRadius:10 }} />}
      {props.route.params.output.map((x,i)=>(<Text style={{fontSize:25,marginTop:40,
  fontWeight:'bold',
  color:'white'}} key={i}>  {`> ${x}`}</Text>))}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle:{
    fontSize:35,
    fontWeight:'bold',
    color:'white',
    marginBottom:100,
  },
  resultTitle:{
    fontSize:
    35,
    fontWeight:'bold',
    color:'white',
    marginTop:50,
    // marginBottom:20,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#6fd2ed',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontWeight:'bold',
  },
});
