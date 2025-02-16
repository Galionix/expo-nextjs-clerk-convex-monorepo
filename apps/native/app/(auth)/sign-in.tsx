import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
// import { Text, TextInput, Button, View } from 'react-native'
import React from 'react'
import { Surface } from '@/components/ui/Surface'
// import { useRegisterCustomer } from '@/hooks/registerCustomer'
import { TextInput } from 'react-native-paper'
import { Button } from '@/components/ui/Button'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  // useRegisterCustomer()
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        // router.replace('/notesDashboard')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }
  const onBackPress = () => router.back()

  return (
    <Surface>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignInPress} >Sign in</Button>
      <Button onPress={onBackPress} >Back</Button>
      {/* <View>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View> */}
    </Surface>
  )
}