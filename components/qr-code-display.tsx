"use client";

import { QRCodeCanvas } from "qrcode.react";

type QRCodeDisplayProps = {
  value: string;
  size?: number;
};

export function QRCodeDisplay({ value, size = 220 }: QRCodeDisplayProps) {
  return (
    <div className="inline-flex rounded-2xl border border-border bg-white p-4">
      <QRCodeCanvas
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
        includeMargin={false}
      />
    </div>
  );
}