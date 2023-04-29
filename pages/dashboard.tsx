import Head from "next/head"
import { useRouter } from "next/router"
import { CreditCard, Landmark, LogOut } from "lucide-react"

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

export default function DashboardPage() {
  const router = useRouter()

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
              src="https://api.dicebear.com/6.x/notionists-neutral/svg?seed="
              alt="avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">shuguang-lv@outlook.com</Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0">
              <Button variant="outline" onClick={() => router.push("/auth")}>
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
          <div className="text-3xl font-bold mb-8">12,234</div>
          <Tabs defaultValue="deposit" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <Card className="pt-8">
                <CardContent className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="deposit"
                    type="number"
                    defaultValue="0"
                    placeholder="Amount"
                  />
                  <Button>Submit</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="withdraw">
              <Card className="pt-8">
                <CardContent className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="withdraw"
                    type="number"
                    defaultValue="0"
                    placeholder="Amount"
                  />
                  <Button>Submit</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
