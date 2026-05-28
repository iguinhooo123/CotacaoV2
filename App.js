import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyC3iEmAtXSYFTO_BtVD_Tk6ARafskIzW18",
  authDomain: "app-teste-2dabd.firebaseapp.com",
  projectId: "app-teste-2dabd",
  storageBucket: "app-teste-2dabd.firebasestorage.app",
  messagingSenderId: "20656501737",
  appId: "1:20656501737:web:692778d2471ecdd644d178",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">

          <Stack.Screen
            name="Login"
            component={ScreenLogin}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Cadastrar"
            component={ScreenCadastrar}
            options={({ navigation }) => ({

              headerShadowVisible: false,

              title: "",

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 20 }}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={28}
                    color="#000000"
                  />
                </TouchableOpacity>
              ),

            })}
          />

          <Stack.Screen
            name="Main"
            component={ScreenMain}
            options={{

              title: "Países",

              headerStyle: {
                backgroundColor: "#2F5BEA",
              },

              headerTintColor: "#fff",

              headerTitleAlign: "center",

              headerShadowVisible: false,

              headerLeft: () => (
                <Ionicons name="menu" size={28} color="#ffffff"
                  style={{ marginLeft: 20 }} />),

              headerRight: () => (
                <TouchableOpacity
                  onPress={() => alert("Notificações (0)!")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color="#fff"
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              ),

            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function ScreenLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Main"))
      .catch(() =>
        Alert.alert("Erro", "E-mail ou senha inválidos.")
      );
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar barStyle="dark-content" />

      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
        }}
        style={styles.worldImage}
      />

      <Text style={styles.loginTitle}>
        CONHEÇA{"\n"}O MUNDO
      </Text>

      <Text style={styles.loginSubtitle}>
        Explore. Descubra. Viaje.
      </Text>

      <View style={styles.inputContainer}>

        <View style={styles.inputBox}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="E-mail"
            style={styles.inputModern}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="Senha"
            style={styles.inputModern}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Ionicons
            name="eye-outline"
            size={20}
            color="#777"
          />
        </View>

      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Cadastrar")}
      >
        <Text style={styles.bottomText}>
          Ainda não tem conta?{" "}
          <Text style={styles.linkText}>
            Cadastre-se
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ScreenCadastrar({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSignup = () => {

    if (!nome || !email || !password || !confirmar) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    if (password !== confirmar) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {

        try {
          const user = userCredential.user;

          await axios.post("http://localhost:3000/users", {
            id: user.uid,
            name: nome,
            email: email,
            password: password,
            photo: "",
            favorites: []
          });

          Alert.alert("Sucesso", "Conta criada!");

          navigation.navigate("Login");

        } catch (err) {
          console.log("Erro Axios:", err);
          Alert.alert("Erro", "Falha ao salvar no servidor.");
        }

      })
      .catch((error) => {

        console.log("Erro Firebase:", error.code);

        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Erro", "E-mail já está em uso.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Erro", "E-mail inválido.");
        } else if (error.code === "auth/weak-password") {
          Alert.alert("Erro", "Senha muito fraca.");
        } else {
          Alert.alert("Erro", error.message);
        }

      });
  };


  return (
    <View style={styles.cadastroContainer}>

      <Text style={styles.cadastroTitle}>
        Criar Conta
      </Text>

      <Text style={styles.cadastroSubtitle}>
        Preencha os dados para se cadastrar
      </Text>

      <View style={styles.inputContainer}>

        <View style={styles.inputBox}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="Nome completo"
            style={styles.inputModern}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="E-mail"
            style={styles.inputModern}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="Senha"
            style={styles.inputModern}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Ionicons
            name="eye-outline"
            size={20}
            color="#777"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#777"
          />

          <TextInput
            placeholder="Confirmar senha"
            style={styles.inputModern}
            secureTextEntry
            value={confirmar}
            onChangeText={setConfirmar}
          />

          <Ionicons
            name="eye-outline"
            size={20}
            color="#777"
          />
        </View>

      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSignup}
      >
        <Text style={styles.loginButtonText}>
          Cadastrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.bottomText}>
          Já tem conta?{" "}
          <Text style={styles.linkText}>
            Faça login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ScreenMain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTime, setClickTime] = useState(null);
  const [search, setSearch] = useState("");

  const paises = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    ARS: "ar",
    CAD: "ca",
    AUD: "au",
    JPY: "jp",
    CNY: "cn",
  };

  async function load() {
    setLoading(true);

    try {
      const now = new Date();

      setClickTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      const res = await fetch(
        "https://economia.awesomeapi.com.br/json/all"
      );

      const json = await res.json();

      const formatted = Object.keys(json).map((key) => {
        const currency = key.split("-")[0];

        return {
          id: key,
          currency,
          name: json[key].name.split("/")[0],
          value: json[key].bid,
          flag: `https://flagcdn.com/w40/${paises[currency] || "un"
            }.png`,
        };
      });

      setData(formatted);

    } catch (err) {
      Alert.alert(
        "Erro",
        "Falha ao carregar cotações."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>

      <View style={styles.topHeader}>
        <View style={styles.searchInput}>
          <Ionicons
            name="search"
            size={20}
            color="#000000"
          />

          <TextInput
            placeholder="Pesquisar país..."
            style={styles.inputModern}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: 25,
              paddingBottom: 65,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemMoeda}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    item.currency,
                    `1 ${item.name} = R$ ${parseFloat(item.value).toFixed(2)}`
                  )
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.flag }}
                    style={styles.flagImage}
                  />

                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.siglaMoeda}>
                      {item.currency}
                    </Text>

                    <Text style={styles.nomeMoeda}>
                      1 {item.name}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.footer}>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home-sharp" size={22} color="#2F5BEA" />
          <Text style={styles.footerTextActive}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="heart-outline" size={22} color="#999" />
          <Text style={styles.footerText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="person-outline" size={22} color="#999" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#EEF5FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  cadastroContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    padding: 25,
  },

  worldImage: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 20,
  },

  loginTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1F2B6C",
    textAlign: "center",
    lineHeight: 45,
  },

  loginSubtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    marginBottom: 30,
  },

  cadastroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
  },

  cadastroSubtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 5,
    marginBottom: 30,
  },

  inputContainer: {
    width: "100%",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    height: 58,
  },

  inputModern: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    height: 35,
    paddingLeft: 3,
  },

  loginButton: {
    backgroundColor: "#2F5BEA",
    width: "100%",
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  bottomText: {
    marginTop: 25,
    color: "#555",
    textAlign: "center",
  },

  linkText: {
    color: "#2F5BEA",
    fontWeight: "bold",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    marginTop: -20,
    paddingTop: 10,
  },

  topHeader: {
    backgroundColor: "#2F5BEA",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },

  statusCard: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 18,
    borderRadius: 20,
    position: "absolute",
    bottom: -35,
    alignItems: "center",
    elevation: 8,
  },

  itemMoeda: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,

    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,

    elevation: 5,
  },

  siglaMoeda: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b3066",
  },

  nomeMoeda: {
    fontSize: 12,
    color: "#888",
  },

  valorMoeda: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28a745",
  },

  updateButton: {
    backgroundColor: "#5BA092",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },

  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  flagMain: {
    width: 80,
    height: 80,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  flagImage: {
    width: 60,
    height: 40,
    borderRadius: 5,
  },

  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 50,
    width: "90%",
  },

  contentContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2F2F2",

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    marginTop: -25,

    overflow: "hidden",
  },

  footer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,

  height: 75,
  backgroundColor: "#fff",

  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",

  borderTopWidth: 1,
  borderTopColor: "#EAEAEA",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 5,

  elevation: 10,
},

footerItem: {
  alignItems: "center",
  justifyContent: "center",
},

footerText: {
  fontSize: 12,
  color: "#999",
  marginTop: 4,
},

footerTextActive: {
  fontSize: 12,
  color: "#2F5BEA",
  marginTop: 4,
  fontWeight: "bold",
},

});
