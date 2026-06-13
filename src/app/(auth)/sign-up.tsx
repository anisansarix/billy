import { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, Alert, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "@/components/ui/AuthInput";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/store";
import "../../../global.css";

export default function SignUpScreen() {
  const router = useRouter();
  const setCurrentBusiness = useAppStore(state => state.setCurrentBusiness);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");

  const handleSignUp = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedCompanyName = companyName.trim();
    const trimmedPhone = phone.trim();
    const sanitizedGst = gst.trim().toUpperCase();

    if (!trimmedFirstName) {
      Alert.alert("Validation Error", "Please enter your first name.");
      return;
    }
    if (!trimmedLastName) {
      Alert.alert("Validation Error", "Please enter your last name.");
      return;
    }
    if (!trimmedCompanyName) {
      Alert.alert("Validation Error", "Please enter your company name.");
      return;
    }
    if (!trimmedPhone) {
      Alert.alert("Validation Error", "Please enter your phone number.");
      return;
    }

    if (sanitizedGst) {
      // Indian GSTIN format: 2 numbers, 5 letters, 4 numbers, 1 letter, 1 alphanumeric, 1 Z, 1 alphanumeric
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(sanitizedGst)) {
        Alert.alert("Invalid GSTIN", "Please enter a valid 15-character GSTIN or leave it blank.");
        return;
      }
    }

    setCurrentBusiness({
            id: "b1",
            legalName: trimmedCompanyName || (trimmedFirstName + " " + trimmedLastName),
            tradeName: trimmedCompanyName,
            gstin: sanitizedGst || "",
            pan: "",
            gstType: "REGULAR" as any,
            address: { line1: "", city: "", state: "", stateCode: "", pincode: "", country: "India" },
            shippingAddresses: [],
            phone: trimmedPhone,
            email: "",
            bankDetails: [],
            fiscalYearStart: "APRIL",
            defaultCurrency: "INR"
        });

    router.replace("/(app)/(dashboard)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>

          <View className="mt-8 mb-8">
            <Text className="text-3xl font-sans-bold text-primary mb-2">
              Register an account
            </Text>
            <Text className="text-base font-sans-regular text-muted-foreground">
              {"Let's connect you with Billy!"}
            </Text>
          </View>

          <AuthInput
            label="First Name"
            placeholder="Enter your first name"
            required
            value={firstName}
            onChangeText={setFirstName}
          />

          <AuthInput
            label="Last Name"
            placeholder="Enter your last name"
            required
            value={lastName}
            onChangeText={setLastName}
          />

          <AuthInput
            label="Company Name"
            placeholder="Enter your company name"
            required
            value={companyName}
            onChangeText={setCompanyName}
          />

          <AuthInput
            label="Phone"
            placeholder="+91   Enter your phone number"
            keyboardType="phone-pad"
            required
            value={phone}
            onChangeText={setPhone}
          />

          <AuthInput
            label="GST"
            placeholder="Enter GST number (Optional)"
            value={gst}
            onChangeText={setGst}
          />

          <Button
            title="Create Account"
            icon={<ArrowRight color="white" size={20} />}
            onPress={handleSignUp}
            className="w-full mt-4 mb-6"
            textClassName="mr-2"
          />

          <View className="flex-row justify-center mb-12">
            <Pressable 
              onPress={() => { Vibration.vibrate(10); router.push("/(auth)/sign-in"); }} 
              className="min-h-[44px] justify-center"
              accessibilityRole="button"
              accessibilityLabel="Already registered?"
            >
              <Text className="text-base font-sans-regular text-muted-foreground">
                Already registered?
              </Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-end items-center mb-4">
            <Text className="text-xs font-sans-regular text-muted-foreground text-center leading-relaxed">
              By signing up you agree to our <Text className="underline text-primary">Terms</Text>, <Text className="underline text-primary">Privacy Policy</Text>,{"\n"}
              and <Text className="underline text-primary">Cookies use</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
