export default function getServerUrl() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return ''
  }

  return 'https://authentication-7t3k.onrender.com'
}
