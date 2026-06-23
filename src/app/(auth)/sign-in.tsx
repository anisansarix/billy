import { useState } from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";
import { Boxes } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View, Image, Vibration } from "react-native";
import { useAlertStore } from "@/store/alertStore";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore, DEFAULT_BUSINESS } from "@/store";
import { supabase } from "@/lib/supabase";
import AuthInput from "@/components/ui/AuthInput";
import Button from "@/components/ui/Button";
import { icons } from "../../../constants/icons";
import "../../../global.css";

export default function SignInScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your email.", type: "error" });
      return;
    }
    if (!password) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your password.", type: "error" });
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsLoading(false);

    if (error) {
      useAlertStore.getState().showAlert({ title: "Sign In Failed", message: error.message, type: "error" });
      return;
    }

    useAppStore.getState().signIn(data.session);
    useAppStore.getState().setCurrentBusiness(DEFAULT_BUSINESS);
    router.replace("/(app)/(dashboard)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >

          <Animated.View entering={FadeInDown.duration(1000).springify().damping(14)} className="items-center mt-6 mb-8">
            <View className="size-20 bg-[#081126] rounded-[24px] items-center justify-center shadow-2xl shadow-black/30 mb-6">
              <Boxes color="white" size={44} strokeWidth={2.5} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(1000).delay(200).springify().damping(14)} className="mb-10 items-center">
            <Text className="text-3xl font-sans-bold text-primary mb-2 text-center">
              Welcome to Billy
            </Text>
            <Text className="text-base font-sans-regular text-muted-foreground text-center">
              {"The ultimate ERP for modern businesses."}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(800).delay(400)}>

          <AuthInput
            label="Email"
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            label="Password"
            placeholder="Enter password"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <View className="flex-row justify-start items-center mt-2 mb-8">
            <Text className="text-sm font-sans-regular text-muted-foreground">
              Forgot your password?{" "}
            </Text>
            <Pressable 
              className="min-h-[44px] justify-center"
              accessibilityRole="button"
              accessibilityLabel="Reset your password"
              onPress={() => Vibration.vibrate(10)}
            >
              <Text className="text-sm font-sans-medium text-primary underline">
                Reset your password
              </Text>
            </Pressable>
          </View>

          <Button
            title="Login"
            loading={isLoading}
            onPress={handleLogin}
            className="w-full mb-6"
          />

          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-sm font-sans-regular text-muted-foreground">
              {"Don't have an account? "}
            </Text>
            <Pressable 
              onPress={() => { Vibration.vibrate(10); router.push("/(auth)/sign-up"); }} 
              className="min-h-[44px] justify-center"
              accessibilityRole="button"
              accessibilityLabel="Join"
            >
              <Text className="text-sm font-sans-medium text-primary underline">
                Join
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-sm font-sans-regular text-muted-foreground">Or</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <Pressable 
            className="w-full h-14 bg-white border border-border items-center justify-center rounded-xl flex-row"
            accessibilityRole="button"
            accessibilityLabel="Sign In with Google"
            onPress={() => Vibration.vibrate(10)}
          >
            <Image 
              source={icons.google} 
              style={{ width: 24, height: 24, marginRight: 12 }} 
              resizeMode="contain" 
            />
            <Text className="text-base font-sans-medium text-primary">
              Sign In with Google
            </Text>
          </Pressable>

          <View className="flex-1 justify-end items-center mt-12 mb-4">
            <Text className="text-xs font-sans-regular text-muted-foreground text-center leading-relaxed">
              By signing in you agree to our <Text className="underline text-primary">Terms</Text>, <Text className="underline text-primary">Privacy Policy</Text>,{"\n"}
              and <Text className="underline text-primary">Cookies use</Text>
            </Text>
          </View>

          </Animated.View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
