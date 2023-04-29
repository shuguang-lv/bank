import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/ui/use-toast"
import { useLocalStorageState } from "ahooks"
import { Landmark, Loader2 } from "lucide-react"

import { validateBalance, validateEmail, validatePassword } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const EMAIL_REGX = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i
const PWD_REGX = /^[a-z0-9_.-]+$/
const NUMBER_REGX = /^[1-9]\d*(\.\d{2})?$/

function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [userToken, setUserToken] = useLocalStorageState<string | undefined>(
    "user-token"
  )
  const [userEmail, setUserEmail] = useLocalStorageState<string | undefined>(
    "user-email"
  )
  const { toast } = useToast()

  const login = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const json = await res.json()
        setUserEmail(json.email)
        setUserToken(json.token)
        router.push("/dashboard")
      } else {
        toast({
          variant: "destructive",
          title: res.statusText,
        })
      }
    } catch (error) {}
    setLoading(false)
  }

  return (
    <Card className="pt-8">
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={loading || email.trim().length === 0} onClick={login}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

function SignupCard() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const validateFields = () =>
    validateEmail(email) &&
    validatePassword(password) &&
    password === password2 &&
    validateBalance(balance)

  const signup = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ email, password, balance }),
      })
      if (res.ok) {
        toast({
          title: "Signup successfully!",
        })
      } else {
        toast({
          variant: "destructive",
          title: res.statusText,
        })
      }
    } catch (error) {}
    setLoading(false)
  }

  return (
    <Card className="pt-8">
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {!validateEmail(email) && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 bg-red-50 p-2"
          >
            <strong className="block font-medium text-sm text-red-800">
              {" "}
              Email format is wrong{" "}
            </strong>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!validatePassword(password) && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 bg-red-50 p-2"
          >
            <strong className="block font-medium text-sm text-red-800">
              {" "}
              Make sure your password only includes underscores, hyphens, dots,
              digits, or lowercase alphabetical characters. The length range of
              it should be [1, 127]{" "}
            </strong>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="password-confirmation">Password Confirmation</Label>
          <Input
            id="password-confirmation"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        {password !== password2 && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 bg-red-50 p-2"
          >
            <strong className="block font-medium text-sm text-red-800">
              {" "}
              2 passwords entered are different{" "}
            </strong>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="balance">Initial Balance</Label>
          <Input
            id="balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
          />
        </div>
        {!validateBalance(balance) && (
          <div
            role="alert"
            className="rounded border-s-4 border-red-500 bg-red-50 p-2"
          >
            <strong className="block font-medium text-sm text-red-800">
              {" "}
              The value of initial balance should be positive without leading 0
              with 2-digit fractional part. The range of it is [0.00,
              4294967295.99]{" "}
            </strong>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={loading || !validateFields()} onClick={signup}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const [userToken] = useLocalStorageState<string | undefined>("user-token")

  useEffect(() => {
    if (userToken) {
      router.push("/dashboard")
    }
  }, [userToken])

  return (
    <div className="flex items-center">
      <Head>
        <title>Bank - Authentication</title>
      </Head>
      <div className="flex items-center mr-[150px]">
        <Landmark size={80} className="mr-6" />
        <h1>Bank</h1>
      </div>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginCard />
        </TabsContent>
        <TabsContent value="signup">
          <SignupCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
