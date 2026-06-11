import type { ImageSourcePropType } from "react-native";

declare module "*.png" {
    const value: ImageSourcePropType;
    export default value;
}

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    // DEPRECATED: Old domain models (BusinessProfile, Party, Item, Invoice, etc.) have been removed.
    // Please import canonical models directly from '@/types/entities'
}
