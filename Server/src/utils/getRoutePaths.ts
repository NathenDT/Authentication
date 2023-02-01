import fs from 'fs'
import path from 'path'

export default function getRoutePaths(_path: string) {
  let routesDir: string[] = ['/ping']

  func('', _path, routesDir)

  return routesDir
}

function func(_path: string, startPath: string, routesDir: string[]) {
  const files = fs.readdirSync(path.join(startPath, _path))

  for (const file of files) {
    const fileExtention = getFileExtention(file)

    if (!fileExtention) {
      func(path.join(_path, file), startPath, routesDir)
      continue
    }

    if (fileExtention != '.ts') continue

    let fileName = file.split('.').shift()!

    if (fileName == 'index') fileName = '/'

    routesDir.push(path.join('/', _path, fileName))
  }
}

function getFileExtention(fileName: string) {
  const splitName = fileName.split('.')
  const splitExtention = splitName.slice(1, splitName.length)

  return (
    Boolean(splitExtention.length) &&
    '.' + splitName.slice(1, splitName.length).join('.')
  )
}
