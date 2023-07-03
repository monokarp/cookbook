import { useInjection } from 'inversify-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Database } from '../../core/database/database';
import { SeedData } from '../../core/database/seed-data';
import { RootViews } from '../root-views.enum';

export function LoadingScreen({ navigation }) {
    const { t } = useTranslation();

    const db = useInjection(Database);
    const seedData = useInjection(SeedData);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isReady) {
            console.log('Init database');
            db.Init()
                .then(() => seedData.Seed())
                .then(() => {
                    setIsReady(true);
                    navigation.navigate(RootViews.Login);
                });
        }
    }), [];

    return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
            <Text>{t('common.loading')}</Text>
        </View>
    );
}

