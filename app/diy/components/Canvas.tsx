'use client'

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

export function ComposerCanvas({ className = '' }) {

  const canvas = useRef<HTMLCanvasElement>(null);
  console.log(canvas);

  let canvasSize = Size.Empty();
  let dprCanvasSize = Size.Empty();
  let context: CanvasRenderingContext2D | null = null;

  function handleOnload(e: SyntheticEvent<HTMLCanvasElement, Event>) {
    TextSprite.canvasSize = ImageSprite.canvasSize = canvasSize = new Size(canvas.current!.width, canvas.current!.height);
    TextSprite.dpr = ImageSprite.dpr = window.devicePixelRatio;
    dprCanvasSize = Size.Multiply(canvasSize, window.devicePixelRatio);

    context = e.currentTarget.getContext('2d')!;
    context.save();
    context.fillStyle = 'grey';
    context.fillRect(0, 0, dprCanvasSize.Width, dprCanvasSize.Height);
    context.restore();
    console.log("### handleNext")
  }


  return (
    <canvas canvas-id="myCanvas" ref={canvas} onClick={handleOnload} onResize={() => console.log("resized")} onLoad={() => console.log("onLoad")} background-color="#808080" />
  )
 
}
