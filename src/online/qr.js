// qr.js —— 入局二维码:房间链接 → 内联 SVG(零外链,不碰图片域)。
import qrcode from 'qrcode-generator';

export function roomQrSvg(text, { cellSize = 4, margin = 2 } = {}) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize, margin, scalable: true });
}

export const joinUrl = code => `${location.origin}/?room=${encodeURIComponent(code)}`;
