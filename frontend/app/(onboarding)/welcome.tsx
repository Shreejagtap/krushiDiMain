import { LanguageContext } from "@/context/LanguageContext";
import { Link, useNavigation } from "expo-router";
import { useContext, useLayoutEffect } from "react";
import { Image, Text, View } from "react-native";
const WelcomeScreen = () => {
  const { t } = useContext(LanguageContext);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("welcome.pageTitle"),
      headerTitleAlign: "center",
    });
  }, []);
  return (
    <View className="flex-1 bg-background">
      <Image
        source={require("@/assets/images/imageWelcome.png")}
        className="w-full h-1/2"
      />
      <View className="mx-6 justify-center flex-1 gap-4">
        <Link
          href={"/login"}
          className="bg-primary text-white py-3 text-center text-xl font-semibold rounded-lg"
        >
          {t("welcome.login")}
        </Link>
        <Text className="text-xl text-center text-secondaryForeground">
          {t("welcome.or")}
        </Text>
        <Link
          href={"/signup"}
          className="bg-secondaryForeground text-white py-3 text-center text-xl font-semibold rounded-lg"
        >
          {t("welcome.register")}
        </Link>
      </View>
    </View>
  );
};
export default WelcomeScreen;
