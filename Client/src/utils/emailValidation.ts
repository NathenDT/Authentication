export default function emailValidation(email: string) {
  return Boolean(email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g))
}
