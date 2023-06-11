import { nextCsrf } from "next-csrf"

const { csrf, setup } = nextCsrf({
  // eslint-disable-next-line no-undef
  secret: process.env.CSRF_SECRET,
  ignoredMethods: ["HEAD", "OPTIONS"],
})

export { csrf, setup }
