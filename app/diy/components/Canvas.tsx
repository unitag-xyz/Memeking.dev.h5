'use client'
import React from 'react';
import { type ReactNode, SyntheticEvent, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import ArrowIcon from '@/assets/images/diy/arrow.svg'
import UploadIcon from '@/assets/images/diy/upload.svg'
import { formatStyleValue } from '@/modules/view'


import {
  EvalScale,
  DegreeToRadians,
  RadiansToDegree,
  Pov2,
  Vec2,
  Size
} from "./common/drawing.js"
import {
  ImageSprite,
  TextSprite
} from "./common/sprite.js"


interface CustomCanvasProps extends CustomProps {
  images: string[],
  callback?: () => void,
  onValueChange?: (value: number) => void
}


export function ComposerCanvas({
  className = '',
  images,
  callback = () => { },
  onValueChange = () => { },
}: CustomCanvasProps) {

  const [spriteImages, setSpriteImages] = useState(images);
  const canvas = useRef<HTMLCanvasElement>(null);
  console.log(canvas);
  let canvasSize = new Size(340, 340);
  let dprCanvasSize = canvasSize;
  function clear() {

    // let context = canvas.current!.getContext('2d');
    // context.save();
    // context.fillStyle = 'grey';
    // context.fillRect(0, 0, dprCanvasSize.Width, dprCanvasSize.Height);
    // context.restore();
  }

  const handleOnload = (e: SyntheticEvent<HTMLCanvasElement, Event>) => {
    TextSprite.canvasSize = ImageSprite.canvasSize = canvasSize;
    TextSprite.dpr = ImageSprite.dpr = window.devicePixelRatio;
    let dprCanvasSize = Size.Multiply(canvasSize, window.devicePixelRatio);

    canvasSize = new Size(canvas.current!.width, canvas.current!.height);
    dprCanvasSize = Size.Multiply(canvasSize, window.devicePixelRatio);

    let context = canvas.current!.getContext('2d')!;
    context.save();
    context.fillStyle = 'grey';
    context.fillRect(0, 0, dprCanvasSize.Width, dprCanvasSize.Height);
    context.restore();
    console.log("### handleNext")
  }

  React.useEffect(() => {
    console.log(spriteImages);
    let context = canvas.current!.getContext('2d')!;
    context.save();
    context.fillStyle = 'grey';
    context.fillRect(0, 0, dprCanvasSize.Width, dprCanvasSize.Height);
    context.restore();
    console.log("### handleUseEffect")
  });

  function addImage(url: string) {
    let image = new Image();
    image.onload = function () {
      let imageSprite = new ImageSprite(image, 0.0);
      imageSprite.draw(canvas.current!.getContext('2d')!);
    }
    image.src = url;
  }

  return (
    <canvas canvas-id="myCanvas" width={340} height={340} ref={canvas} onClick={handleOnload} onResize={() => console.log("resized")} background-color="#808080" />
  )
}
