// @ts-ignore
import md5 from 'blueimp-md5'
/**
 * 计算md5
 * @param file
 * @returns {Promise<any>}
 */
export function computeMD5 (file: File) {
  return new Promise((resolve, reject) => {
    // 计算文件内容MD5
    // 声明必要的变量
    let fileReader = new FileReader()
    // 文件分割方法（注意兼容性）
    // @ts-ignore
    let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice
    // 文件每块分割1M，计算分割详情
    let chunkSize = 1048576
    let chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    // 最终MD5值
    let resultMd5 = ''
    // 处理单片文件的上传
    const loadNext = () => {
      let start = currentChunk * chunkSize
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsBinaryString(blobSlice.call(file, start, end))
    }
    // 每块文件读取完毕之后的处理

    fileReader.onload = (e: any) => {
      // console.log('读取文件', currentChunk + 1, '/', chunks)
      // 每块交由MD5对象进行计算
      resultMd5 = md5(resultMd5 + e.target.result)
      currentChunk++
      // 如果文件处理完成计算MD5，如果还有分片继续处理
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(resultMd5)
      }
    }

    loadNext()
  })
}
