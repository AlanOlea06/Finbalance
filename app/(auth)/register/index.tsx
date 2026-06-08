import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import BenefitSide from "../../../components/BenefitSide";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

export default function RegisterController() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const esMovil = width < 768;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    pais: "",
    ciudad: "",
    moneda: "",
    useType: "personal",
    employees: [],
    fixedExpenses: [],
    hasFixedSalary: "no",
    fixedSalaryAmount: "0",
    fixedSalaryFrequency: "semanal",
    payDayWeekly: "1",
    payDayMonthly1: "15",
    payDayMonthly2: "30",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      alert("¡Cuenta creada exitosamente en Supabase!");
      router.push("/dashboard");
    } catch (error) {
      alert("Error al crear cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.leftSide}
        contentContainerStyle={styles.leftScrollContent}
        showsVerticalScrollIndicator={true}
      >
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <Step4
            formData={formData}
            setFormData={setFormData}
            onBack={prevStep}
            onSubmit={handleFinalSubmit}
            isLoading={isLoading}
          />
        )}
      </ScrollView>

      {!esMovil && (
        <View style={styles.rightSide}>
          <BenefitSide />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: "row" },
  leftSide: { flex: 1, backgroundColor: "#0F8B7B" },
  leftScrollContent: {
    flexGrow: 1,
    padding: 40,
    justifyContent: "center",
  },
  rightSide: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
