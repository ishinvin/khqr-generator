import QRCode from 'qrcode'
import khqrFrame from '@/assets/qrstand.png'
import NunitoSansBold from '@/assets/NunitoSans-Bold.ttf'
import NunitoSansRegular from '@/assets/NunitoSans-Regular.ttf'

// import BND from '@/assets/ccy/bnd.svg'
// import CNY from '@/assets/ccy/cny.svg'
// import IDR from '@/assets/ccy/idr.svg'
// import INR from '@/assets/ccy/inr.svg'
import KHR from '@/assets/ccy/khr.svg'
// import LAK from '@/assets/ccy/lak.svg'
// import MMK from '@/assets/ccy/mmk.svg'
// import MYR from '@/assets/ccy/myr.svg'
// import PHP from '@/assets/ccy/php.svg'
// import SGD from '@/assets/ccy/sgd.svg'
// import THB from '@/assets/ccy/thb.svg'
import USD from '@/assets/ccy/usd.svg'
// import VND from '@/assets/ccy/vnd.svg'
// import EUR from '@/assets/ccy/eur.svg'
// import CZK from '@/assets/ccy/czk.svg'
// import AUD from '@/assets/ccy/aud.svg'
import { CURRENCY } from 'ts-khqr'

const ccy: Record<string, string> = {
  // [CURRENCY.BND]: BND,
  // [CURRENCY.CNY]: CNY,
  // [CURRENCY.IDR]: IDR,
  // [CURRENCY.INR]: INR,
  [CURRENCY.KHR]: KHR,
  // [CURRENCY.LAK]: LAK,
  // [CURRENCY.MMK]: MMK,
  // [CURRENCY.MYR]: MYR,
  // [CURRENCY.PHP]: PHP,
  // [CURRENCY.SGD]: SGD,
  // [CURRENCY.THB]: THB,
  [CURRENCY.USD]: USD,
  // [CURRENCY.VND]: VND,
  // [CURRENCY.EUR]: EUR,
  // [CURRENCY.CZK]: CZK,
  // [CURRENCY.AUD]: AUD,
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`load ${url} fail`))
    img.src = url
  })
}

export class QRCanvasFactory {
  private qrText: string
  private currency: string
  private bakongAccount: string
  private labelName: string

  // fonts
  private _regularFont = new FontFace('NunitoSansRegular', `url(${NunitoSansRegular})`)
  private _boldFont = new FontFace('NunitoSansBold', `url(${NunitoSansBold})`)

  constructor(qrText: string, currency: string, labelName: string, bakongAccount: string = '') {
    this.qrText = qrText
    this.currency = currency
    this.bakongAccount = bakongAccount
    this.labelName = labelName
  }

  async createQR() {
    const canvas = document.createElement('canvas')
    const stand = await loadImage(khqrFrame)
    const width = stand.width
    const height = stand.height
    canvas.width = width
    canvas.height = height

    // Draw QR stand
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.drawImage(stand, 0, 0)

    // Generate QR code
    const qrFrame = width * 0.455
    const qrSize = qrFrame * 0.86
    const qrcode = await QRCode.toDataURL(this.qrText, { width: qrSize, margin: 0 })
    const qrImage = await loadImage(qrcode)

    // Draw QR image
    const offsetW = width / 2 - qrSize / 2
    const offsetH = height * 0.32
    context.drawImage(qrImage, offsetW, offsetH)

    // Draw currency in the middle of QR
    if (Object.values(CURRENCY).includes(this.currency)) {
      const ccyWidth = qrSize * 0.2
      const ccyImage = await loadImage(ccy[this.currency])
      context.drawImage(
        ccyImage,
        offsetW + qrSize / 2 - ccyWidth / 2,
        offsetH + qrSize / 2 - ccyWidth / 2,
        ccyWidth,
        ccyWidth
      )
    }

    // Register custom font
    const font = await this._regularFont.load()
    const fontBold = await this._boldFont.load()
    document.fonts.add(font)
    document.fonts.add(fontBold)

    context.font = `bold ${qrFrame * 0.12}pt ${fontBold.family}`
    context.textAlign = 'center'
    context.textBaseline = 'top'

    // Draw Merchant name
    const isLongName = this.labelName.length > 15
    if (isLongName) {
      const splitText = this.labelName.split(' ')
      context.fillText(splitText[0].toUpperCase(), width / 2, height * 0.67)
      if (splitText[1]) {
        context.fillText(splitText.slice(1).join(' ').toUpperCase(), width / 2, height * 0.725)
      }
    } else {
      context.fillText(this.labelName.toUpperCase(), width / 2, height * 0.67)
    }

    // Draw merchant ID
    context.font = `${qrFrame * 0.06}pt ${font.family}`
    if (this.bakongAccount) {
      context.fillText(this.bakongAccount, width / 2, height * (isLongName ? 0.79 : 0.7325))
    }

    const imageData = canvas.toDataURL('image/png')
    // Clean up
    document.fonts.delete(font)
    document.fonts.delete(fontBold)
    canvas.remove()

    return imageData
  }
}
