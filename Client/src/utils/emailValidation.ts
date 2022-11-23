export default function emailValidation(email: string): Boolean {
  return Boolean(email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g))
}
