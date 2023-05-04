import { useEffect, useState } from "react";

import { Alert } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import { Realm, useApp } from "@realm/react"

import { Container, Title, Slogan } from './styles';
import { Button } from '../../components/Button';

import BackGroundIMG from "../../assets/background.png";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID} from '@env'

WebBrowser.maybeCompleteAuthSession();

export function Signin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const app = useApp();

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  });

  function handleGoogleSignIn(){
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if(response.type !== 'success'){
        setIsAuthenticating(false);
      }
    })
  }

  useEffect(() => {
    if(response?.type === 'success'){
      if(response.authentication?.idToken){
        const credentials = Realm.Credentials.jwt(response.authentication.idToken)

        app.logIn(credentials).catch((error) =>{
          console.log(error)
          Alert.alert('Entrar', 'Não foi possivle conectar-se a sua conta google')
          setIsAuthenticating(false);
        })
      }else{
        Alert.alert('Entrar', 'Não foi possivle conectar-se a sua conta google')
        setIsAuthenticating(false);
      }
    }
  }, [response])

  return (
    <Container source={BackGroundIMG}>
      <Title>
        IgniteFleet
      </Title>

      <Slogan>
        Gestão de uso de veiculos
      </Slogan> 

      <Button 
       title='Entrar com Google' 
       onPress={handleGoogleSignIn}
       isLoading={isAuthenticating}
      />
    </Container>
  );
}