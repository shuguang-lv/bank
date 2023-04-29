import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Landmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const router = useRouter()

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/dashboard")
  }, [router])

  return (
    <>
      <Head>
        <title>Bank - Authentication</title>
      </Head>
      <div className="flex items-center mb-16">
        <Landmark size={80} className="mr-4" />
        <h1>Bank</h1>
      </div>
      <Tabs value={tab} className="w-[400px] mb-[150px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" onClick={() => setTab("login")}>
            Log in
          </TabsTrigger>
          <TabsTrigger value="signup" onClick={() => setTab("signup")}>
            Sign up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="pt-8">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/dashboard")}>Submit</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="pt-8">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-confirmation">
                  Password Confirmation
                </Label>
                <Input
                  id="password-confirmation"
                  type="password"
                  defaultValue=""
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="balance">Initial Balance</Label>
                <Input id="balance" type="number" defaultValue="0" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setTab("login")}>Submit</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
