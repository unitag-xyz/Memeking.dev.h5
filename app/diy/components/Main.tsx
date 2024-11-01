'use client'

import { Input } from '@nextui-org/input'
import { useEffect, useRef, useState } from 'react'

import AddIcon from '@/assets/images/diy/add.svg'
import AddButton from '@/assets/images/diy/button/add.svg'
import DownloadButton from '@/assets/images/diy/button/download.svg'
import SaveButton from '@/assets/images/diy/button/save.svg'
import ShareButton from '@/assets/images/diy/button/share.svg'
import Button from '@/components/Button'

import { ItemList } from './ItemList'

import { ComposerCanvas } from './Canvas'
import Slider from './Slider'


export function Main() {

  const cCanvas = useRef({});

  const index = 0
  const [itemType, setItemType] = useState<'image' | 'text'>()
  const [content, setContent] = useState('')
  const [rotation, setRotation] = useState(0)
  const [size, setSize] = useState(1)
  const [opacity, setOpacity] = useState(1)

  let images = Array<string>();

  const items = new Array(10)
  for (let i = 0; i < items.length; i++) {
    items[i] = i
  }

  function handleAddText() { }
  function handleAddImage() {
    console.log("### handleAddImage");
    console.log(cCanvas.current);
    images.push("https://via.placeholder.com/150");
    console.log(images);
    //cCanvas.current.handleOnload(null);
  }

  function handleReset() { }
  function handleDelete() { }

 

  return (
    <div className="mx-[20px] md:mx-[40px]">
      <div className="mx-auto flex max-w-[1200px]">
        <div className="w-[500px] shrink-0 bg-[linear-gradient(180deg,#FFE3B1_0%,#FFEFD4_100%)] pt-[40px]">

          <div className="mx-auto w-[340px]">
            <div className="mb-[30px] flex flex-col items-center gap-y-[10px]">
              <div className="h-[340px] w-[340px]"> 
                <ComposerCanvas images={images}  onValueChange={()=>console.log("onValChange")} className="" />
              </div>
              <div className="flex items-center gap-x-[10px]">
                <AddButton className="cursor-pointer" onClick={handleAddImage} />
                <DownloadButton className="cursor-pointer" />
                <SaveButton className="cursor-pointer" />
                <ShareButton className="cursor-pointer" />
              </div>
            </div>
            {itemType && (
              <>
                <div className="mb-[40px] flex flex-col gap-y-[20px]">
                  {(() => {
                    if (itemType === 'image')
                      return (
                        <>
                          <div className="flex items-center gap-x-[10px]">
                            <div
                              className="h-[60px] w-[60px] rounded-[12px] border-2 border-solid border-[#563B00]"
                              style={{
                                background: `url(${content})`,
                              }}
                            />
                            <div className="text-[24px]"># {index}</div>
                          </div>
                          <div className="flex flex-col gap-y-[10px]">
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Rotation</div>
                              <Slider
                                label="Rotation"
                                step={5}
                                defaultValue={0}
                                maxValue={360}
                                minValue={0}
                                onValueChange={setRotation}
                              />
                            </div>
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Size</div>
                              <Slider
                                label="Size"
                                step={0.1}
                                defaultValue={1}
                                maxValue={3}
                                minValue={0}
                                onValueChange={setSize}
                              />
                            </div>
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Opacity</div>
                              <Slider
                                label="Opacity"
                                step={0.1}
                                defaultValue={1}
                                maxValue={1}
                                minValue={0}
                                onValueChange={setOpacity}
                              />
                            </div>
                          </div>
                        </>
                      )
                    else if (itemType === 'text')
                      return (
                        <>
                          <div className="text-[24px]">Text: # {index}</div>
                          <Input defaultValue={content} onValueChange={setContent} />
                          <div className="flex flex-col gap-y-[10px]">
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Rotation</div>
                              <Slider
                                label="Rotation"
                                step={5}
                                defaultValue={0}
                                maxValue={360}
                                minValue={0}
                                onValueChange={setRotation}
                              />
                            </div>
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Size</div>
                              <Slider
                                label="Size"
                                step={0.1}
                                defaultValue={1}
                                maxValue={3}
                                minValue={0}
                                onValueChange={setSize}
                              />
                            </div>
                            <div className="flex items-center gap-x-[10px]">
                              <div className="w-[130px] shrink-0 text-[18px]">Opacity</div>
                              <Slider
                                label="Opacity"
                                step={0.1}
                                defaultValue={1}
                                maxValue={1}
                                minValue={0}
                                onValueChange={setOpacity}
                              />
                            </div>
                          </div>
                        </>
                      )
                  })()}
                </div>
                <div className="flex items-center gap-x-[16px]">
                  <Button onPress={handleReset} className="flex-1" isShadow>
                    Reset
                  </Button>
                  <Button onPress={handleDelete} className="flex-1" isShadow>
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-[30px] px-[20px] pt-[40px]">
          <div className="space-y-[10px]">
            <div className="text-[24px]">Background</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Ornaments</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Logo</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">Text</div>
            <div
              className={
                'flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[#563B00] bg-transparent transition-colors hover:bg-[#FFB433] focus:bg-[#FFB433]'
              }
              onClick={handleAddText}
            >
              <AddIcon />
            </div>
          </div>
          <div className="space-y-[10px]">
            <div className="text-[24px]">History</div>
            <ItemList className="h-[90px]" items={items} itemSize={90} />
          </div>
        </div>
      </div>
    </div>
  )
}
