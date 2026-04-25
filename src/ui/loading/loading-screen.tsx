import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Environment } from "../env";
import { useSession } from "../login/session.store";
import { RootStackParamList } from "../navigation.types";
import { RootViews } from "../root-views.enum";
import { useServices } from "../services-context";

type Props = NativeStackScreenProps<RootStackParamList, RootViews.Loading>;

export function LoadingScreen({ navigation }: Props) {
    const { db, seedData, dataSync: ds } = useServices();

    const { user, hasInitialized, initialize } = useSession();
    if (!user?.id) {
        throw new Error("User not logged in");
    }

    const userId = user.id;

    async function loadData() {
        console.log("Init database");

        const { didRunMigrations, isFreshInstall } = await db.Init();

        if (Environment.Type === "Test" && isFreshInstall) {
            await seedData.Seed();
        }

        if (Environment.Type !== "Test") {
            if (isFreshInstall) {
                await ds.recover(userId);
            } else if (didRunMigrations) {
                await ds.pushAllLocal(userId);
            }

            await ds.start(userId);
        }

        initialize();
    }

    useEffect(() => {
        (async function () {
            if (!hasInitialized) {
                await loadData();
            }

            navigation.navigate(RootViews.Home);
        })();
    });

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator animating={!hasInitialized} />
        </View>
    );
}
