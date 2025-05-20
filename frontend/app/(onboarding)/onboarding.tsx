import { LanguageContext } from "@/context/LanguageContext";
import { Link, useNavigation } from "expo-router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Onboarding = () => {
  const { t, changeLanguage, language } = useContext(LanguageContext);

  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "मराठी", value: "mr" },
    { label: "हिंदी", value: "hi" },
    { label: "English", value: "en" },
  ]);

  useEffect(() => {
    changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="bg-white flex-1 items-center justify-between px-4"
    >
      <DropDownPicker
        open={open}
        value={selectedLanguage}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedLanguage}
        setItems={setItems}
        style={style.dropdown}
        dropDownContainerStyle={style.dropdown}
        placeholder="Language/भाषा"
      />
      <Image source={require("@/assets/images/logo.png")} />
      <View className="mb-10 gap-4">
        <Text className="text-xl text-center text-secondaryForeground">
          {t("onboarding.title")}
        </Text>
        <Link href={"/welcome"} asChild>
          <Text className="bg-primary text-center py-4 min-w-full rounded-lg text-white font-bold text-lg">
            {t("onboarding.continue")}
          </Text>
        </Link>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  dropdown: {
    width: 200,
    marginTop: 20,
    borderColor: "transparent",
    backgroundColor: "#67ff005c",
  },
});
export default Onboarding;
