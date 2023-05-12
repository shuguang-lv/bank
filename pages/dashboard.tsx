import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/ui/use-toast"
import { useLocalStorageState } from "ahooks"
import { CreditCard, Landmark, Loader2, LogOut } from "lucide-react"

import { StatusCode, handleErrorMsg, validateBalance } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AmountAlert() {
  return (
    <div
      role="alert"
      className="rounded border-s-4 border-red-500 bg-red-50 p-2"
    >
      <strong className="block font-medium text-sm text-red-800">
        {" "}
        The amount should be positive without leading 0 with 2-digit fractional
        part. The range of it is (0.00, 4294967295.99]{" "}
      </strong>
    </div>
  )
}

function DepositCard({
  userToken,
  setBalance,
}: {
  userToken: string | undefined
  setBalance: (balance: number) => void
}) {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const deposit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ amount }),
      })
      if (res.ok) {
        const json = await res.json()
        setBalance(json.balance ?? 0)
        toast({
          title: "Deposit successfully!",
        })
      } else {
        toast({
          variant: "destructive",
          title: handleErrorMsg(res.status as StatusCode),
        })
      }
    } catch (error) {}
    setLoading(false)
  }

  return (
    <Card className="pt-8">
      <CardContent className="w-full max-w-sm space-x-2">
        <div className="flex justify-between mb-4">
          <Input
            id="deposit"
            type="number"
            placeholder="Amount"
            value={amount === 0 ? "" : amount.toString().replace(/^0+/, "")}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button
            className="ml-2"
            disabled={loading || !validateBalance(amount)}
            onClick={deposit}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
        {!validateBalance(amount) && <AmountAlert />}
      </CardContent>
    </Card>
  )
}

function WithdrawCard({
  userToken,
  setBalance,
}: {
  userToken: string | undefined
  setBalance: (balance: number) => void
}) {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const withdraw = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ amount }),
      })
      if (res.ok) {
        const json = await res.json()
        setBalance(json.balance ?? 0)
        toast({
          title: "Withdraw successfully!",
        })
      } else {
        toast({
          variant: "destructive",
          title: handleErrorMsg(res.status as StatusCode),
        })
      }
    } catch (error) {}
    setLoading(false)
  }

  return (
    <Card className="pt-8">
      <CardContent className="w-full max-w-sm space-x-2">
        <div className="flex justify-between mb-4">
          <Input
            id="withdraw"
            type="number"
            placeholder="Amount"
            value={amount === 0 ? "" : amount.toString().replace(/^0+/, "")}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button
            className="ml-2"
            disabled={loading || !validateBalance(amount)}
            onClick={withdraw}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
        {!validateBalance(amount) && <AmountAlert />}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userToken, setUserToken] = useLocalStorageState<string | undefined>(
    "user-token"
  )
  const [userNameLocal, setUserNameLocal] = useLocalStorageState<
    string | undefined
  >("user-name")
  const [username, setUsername] = useState("")
  const [balance, setBalance] = useState(0)

  const getBalance = async () => {
    try {
      const res = await fetch("/api/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${userToken}`,
        },
      })
      if (res.ok) {
        const json = await res.json()
        setBalance(json.balance ?? 0)
      } else {
        toast({
          variant: "destructive",
          title: handleErrorMsg(res.status as StatusCode),
        })
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!userToken) {
      router.push("/auth")
      setTimeout(
        () =>
          toast({
            variant: "destructive",
            title: "User token is invalid! Please login",
          }),
        0
      )
    }
    setUsername(userNameLocal ?? "")
    getBalance()
  }, [userToken])

  const logout = () => {
    setUserToken(undefined)
    setUserNameLocal(undefined)
    router.push("/auth")
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Head>
        <title>Bank - Dashboard</title>
      </Head>
      <div className="flex justify-between p-4 w-full bg-gray-50">
        <div className="flex items-center align-middle">
          <Landmark size={30} className="mr-4" />
          <h4 className="mt-0">Bank</h4>
          <Separator orientation="vertical" className="mx-4 h-6" />
          <h5 className="mt-0">Dashboard</h5>
        </div>
        <div className="flex items-center mr-2">
          <Avatar className="mr-4">
            <AvatarImage
              src={
                "https://api.dicebear.com/6.x/notionists-neutral/svg?seed=" +
                username
              }
              alt="avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">{username}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0">
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Card className="mt-[150px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium mt-0">Balance</CardTitle>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-8">
            {Number(balance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <Tabs defaultValue="deposit" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <DepositCard userToken={userToken} setBalance={setBalance} />
            </TabsContent>
            <TabsContent value="withdraw">
              <WithdrawCard userToken={userToken} setBalance={setBalance} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
