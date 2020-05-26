import { Storage } from '@google-cloud/storage'
const storage = new Storage({
  keyFilename: './private-key.json',
  projectId: 'workers-storage-258100'
})

export async function folderExists (folder: string) : Promise<void> {
  const allbuckets = []
  const buckets = await storage.getBuckets()
  buckets[0].forEach(bucket => {
    allbuckets.push(bucket.metadata)
  })

  const verify = allbuckets.find(e => e.name === folder)

  return verify
}

export async function createBucket (folder: string): Promise<any> {
  const exists = await folderExists(folder)

  if (exists === undefined) {
    return exists
  } else {
    const bucket = await storage.createBucket(folder)
    return bucket[0]
  }
}
