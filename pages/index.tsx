import { useEffect } from "react"
import { useRouter } from "next/router"
import { useLocalStorageState } from "ahooks"
import { Landmark } from "lucide-react"

export default function DefaultPage() {
  const router = useRouter()
  const [userToken, _] = useLocalStorageState<string | undefined>("user-token")
  const { target } = router.query

  // useEffect(() => {
  //   if (!userToken) {
  //     router.push("/auth")
  //   } else {
  //     router.push("/dashboard")
  //   }
  // }, [userToken])

  useEffect(() => {
    if (userToken && target) {
      router.push(target as string)
    } else if (!userToken) {
      router.push(`/auth${target ? `?target=${target}` : ""}`)
    } else {
      router.push("/dashboard")
    }
  }, [userToken, target])

  return (
    <div className="flex items-center">
      <Landmark size={80} className="mr-6" />
      <h1>Bank</h1>
    </div>
  )
}
