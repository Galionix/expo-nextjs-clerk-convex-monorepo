import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Surface } from "@/components/ui/Surface";
import { P } from "@/components/ui/Text";
import { TextInput } from "react-native-paper";
import { Button } from "@/components/ui/Button";
import { useRegisterCustomer } from '@/hooks/registerCustomer';
import { useToast } from '@/components/Toast/Toast';



export default function SignUpScreen() {
  const { isLoaded, signUp, setActive,  } = useSignUp();
  // useSignIn
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  useRegisterCustomer();
  const toaster = useToast();

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      toaster.show({
        type: 'error',
        message: err.errors.map(e=>e.longMessage).join(', ')
      })
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  // const onSignUpGooglePress = async () => {
  //   if (!isLoaded) return;

  //   // Start sign-up process using email and password provided
  //   try {
  //       const resource = await signUp.create({
  //           strategy: 'oauth_google',
  //           redirectUrl: '/login'
  //       // emailAddress,
  //       // password,
  //     });

  //       resource.prepareVerification({
  //           strategy: 'oauth_google'
  //       })
  //       // await signUp.authenticateWithRedirect({
  //       //     // strategy: 'oauth_google',
  //       //     redirectUrl: ''
  //       // })
  //     // Send user an email with verification code
  //   //   await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

  //     // Set 'pendingVerification' to true to display second form
  //     // and capture OTP code
  //   //   setPendingVerification(true);
  //   } catch (err) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // router.replace("/");
      } else {

        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      toaster.show({
        type: 'error',
        message: err.errors.map(e=>e.longMessage).join(', ')
      })
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onBackPress = () => setPendingVerification(false)
  if (pendingVerification) {
    return (
      <Surface>
        <P>Verify your email</P>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button onPress={onVerifyPress}>Verify</Button>
        <Button onPress={onBackPress}>Change email</Button>

      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.form}>
        <P>Sign up</P>
        <TextInput
          style={{
            width: 300,
          }}
          autoCapitalize="none"
          keyboardType='email-address'
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={{
            width: 300,
            // paddingRight: "2%",
          }}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button onPress={onSignUpPress}> Continue</Button>
        {/* <Button onPress={onSignUpGooglePress}> Continue with google</Button> */}

      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    // ...debugStyle
    // backgroundColor: "white",
  },
  form: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
});
