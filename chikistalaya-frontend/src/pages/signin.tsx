import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const isLogin = form.getAttribute('data-form-type') === 'login';

    try {
      if (isLogin) {
        // Log in existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // (1) Save user session
        sessionStorage.setItem('authUser', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));

        // (2) Navigate to /userdashboard/:uid
        navigate(`/userdashboard/${user.uid}`);
      } else {
        // Register new user
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send user data to your backend
        await fetch('https://curo-156q.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email,
            name
          }),
        });

        // (1) Save user session
        sessionStorage.setItem('authUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          name
        }));

        // (2) Navigate to /userdashboard/:uid
        navigate(`/userdashboard/${user.uid}`);
      }
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to your backend
      await fetch('https://curo-156q.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        }),
      });

      // (1) Save user session
      sessionStorage.setItem('authUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName
      }));

      // (2) Navigate to /userdashboard/:uid
      navigate(`/userdashboard/${user.uid}`);
    } catch (err: any) {

    }
  };



  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="flex flex-col items-center justify-center w-full px-4 py-8 mx-auto">
        <div className="w-full sm:w-[480px] md:w-[540px] lg:w-[600px] bg-purple-900/90 border border-purple-400/30 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="w-full px-6 py-8 md:px-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-purple-600 rounded-full"></div>
              <span className="text-2xl font-bold text-purple-400 ml-3">Chikistalaya</span>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-800/50">
                <TabsTrigger value="login" className="text-sm sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm sm:text-base data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="w-full">
                <form data-form-type="login" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white placeholder:text-purple-200 focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="w-full">
                <form data-form-type="signup" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white placeholder:text-purple-200 focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white placeholder:text-purple-200 focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      className="w-full bg-purple-800/50 border-purple-400/30 text-white focus:border-purple-300 focus:ring-purple-300"
                    />
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-900/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-900 text-purple-200">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 bg-purple-800/50 border-purple-400/30 text-white hover:bg-purple-700 hover:text-white"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}