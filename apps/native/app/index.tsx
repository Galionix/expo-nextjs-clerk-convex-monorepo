import { Redirect } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

export default function Index() {
  return <Redirect href="/notesDashboard" />;
}
