import { googleClient, googleCloudClientID } from '../index'

async function google(token: string): Promise<any> {
  try {
    return await googleClient.verifyIdToken({
      idToken: token,
      audience: googleCloudClientID
    })
  } catch(e) {
    return false
  }
}

export {
  google
}
