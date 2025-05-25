import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	const colors = Colors;
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.tabIconSelected,
				headerStyle: { backgroundColor: colors.background },
				headerShadowVisible: false,
				headerTintColor: colors.headerTint,
				tabBarStyle: { backgroundColor: colors.background },
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? 'home-sharp' : 'home-outline'}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? 'person-circle' : 'person-circle-outline'}
							color={color}
							size={24}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
