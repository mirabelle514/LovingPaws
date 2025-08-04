import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={globalStyles.notFoundContainer}>
        <Text style={globalStyles.notFoundText}>This screen doesn't exist.</Text>
        <Link href="/" style={globalStyles.notFoundLink}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
