import { MD3TypescaleKey, Text as T, TextProps } from "react-native-paper";
import { StyleSheet } from "react-native";
import { lightTheme } from '@/constants/theme';
type AdditionalTextProps = {
  highlight: boolean;
  accent: boolean;
};
// const getAdditionalProps = (atp: Partial<AdditionalTextProps>)=> {

//     let result: Partial<TextProps<MD3TypescaleKey>> = {}
//     if (atp.highlight) {
//         result.style.color
//     }
// }

const h1Defaults: Partial<TextProps<MD3TypescaleKey>> = {
  variant: "displaySmall",
};
export const H1 = ({ children, ...rest }: TextProps<MD3TypescaleKey>) => (
  <T {...{ ...h1Defaults, ...rest }}>{children}</T>
);

const pDefaults: Partial<TextProps<MD3TypescaleKey>> = {
  variant: "bodyLarge",
};
export const P = ({
  children,
  ...rest
}: TextProps<MD3TypescaleKey> & Partial<AdditionalTextProps>) => {
  if (rest.highlight) return <T {...{ ...pDefaults, ...rest }} style={styles.highlight}>{children}</T>;

  return <T {...{ ...pDefaults, ...rest }}>{children}</T>;
};

const styles = StyleSheet.create({
    highlight: {
        color: lightTheme.colors.highlight,
        fontFamily: "SemiBold",
      },
});
