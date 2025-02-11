import { Surface as S, SurfaceProps } from "react-native-paper";

const defaults: Partial<SurfaceProps> = {
    style: {
        flex: 1,
        gap: 10,
        // justifyContent: "center",
        // alignItems: "center",
    }
}

export const Surface = ({ children, ...rest }: SurfaceProps) => (
    <S {...{ ...defaults, ...rest }} style={{
        ...defaults.style as any,
        ...rest.style as any
    }}>{children}</S>
);
