import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function GoogleAuthTest() {
  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log("USER:", result.user);
    alert(`Welcome ${result.user.displayName}`);
  };

  return <button onClick={login}>Test Google Login</button>;
}
