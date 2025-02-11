import { Button as B, ButtonProps } from "react-native-paper";

const defaults: Partial<ButtonProps> = {
    mode: 'outlined'
}
export const Button = ({ children, ...rest }: ButtonProps) => (
  <B {...{...defaults,...rest}}>{children}</B>
);
