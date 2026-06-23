import { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View, Vibration } from "react-native";
import { useAlertStore } from "@/store/alertStore";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "@/components/ui/AuthInput";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { GSTType } from "@/types/entities";
import "../../../global.css";

export default function SignUpScreen() {
  const router = useRouter();
  const setCurrentBusiness = useAppStore(state => state.setCurrentBusiness);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gst, setGst] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedCompanyName = companyName.trim();
    const trimmedPhone = phone.trim();
    const sanitizedGst = gst.trim().toUpperCase();

    if (!firstName) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your first name.", type: "error" });
      return;
    }
    if (!lastName) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your last name.", type: "error" });
      return;
    }
    if (!companyName) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your company name.", type: "error" });
      return;
    }
    if (!phone) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your phone number.", type: "error" });
      return;
    }
    if (!email) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter your email.", type: "error" });
      return;
    }
    if (!password) {
      useAlertStore.getState().showAlert({ title: "Validation Error", message: "Please enter a password.", type: "error" });
      return;
    }

    if (sanitizedGst) {
      if (sanitizedGst.length !== 15) {
        useAlertStore.getState().showAlert({ title: "Invalid GSTIN", message: "Please enter a valid 15-character GSTIN or leave it blank.", type: "error" });
        return;
      }
    }

    setCurrentBusiness({
            id: "b1",
            legalName: trimmedCompanyName || (trimmedFirstName + " " + trimmedLastName),
            tradeName: trimmedCompanyName,
            gstin: sanitizedGst || "",
            pan: "",
            gstType: GSTType.REGULAR,
            address: { line1: "", city: "", state: "", stateCode: "", pincode: "", country: "India" },
            shippingAddresses: [],
            phone: trimmedPhone,
            email: email.trim(),
            bankDetails: [],
            fiscalYearStart: "APRIL",
            defaultCurrency: 'INR'
    });

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            company_name: trimmedCompanyName,
            phone: trimmedPhone,
            gstin: sanitizedGst || null,
          }
        }
      });

      if (error) {
        useAlertStore.getState().showAlert({ title: "Sign Up Failed", message: error.message, type: "error" });
        return;
      }

      if (data.session) {
        useAppStore.getState().signIn(data.session);
      }

      router.replace("/(app)/(dashboard)/dashboard");
    } catch (error: any) {
      useAlertStore.getState().showAlert({ title: "Sign Up Failed", message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
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

          <View className="mt-8 mb-8">
            <Text className="text-3xl font-sans-bold text-primary mb-2">
              Register an account
            </Text>
            <Text className="text-base font-sans-regular text-muted-foreground">
              Set up your Billy workspace.
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
            label="Business Name"
            placeholder="Enter your business name"
            required
            value={companyName}
            onChangeText={setCompanyName}
          />

          <AuthInput
            label="Phone Number"
            placeholder="+91"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <AuthInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AuthInput
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
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
            iconPosition="right"
            loading={isLoading}
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

        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
