import { Slider } from '@nextui-org/slider'
import { useState } from 'react'

interface CustomSliderProps extends CustomProps {
  label: string
  defaultValue: number
  minValue: number
  maxValue: number
  step: number
  onValueChange?: (value: number) => void
}

export default function CustomSlider({
  className = '',
  label,
  defaultValue,
  minValue,
  maxValue,
  step,
  onValueChange = () => {},
}: CustomSliderProps) {
  const [value, setValue] = useState(defaultValue)

  function handleValueChange(value: number | number[]) {
    const newValue = typeof value === 'number' ? value : value[0]
    setValue(newValue)
    onValueChange(newValue)
  }

  return (
    <Slider
      aria-label={label}
      classNames={{
        base: 'bg-white border border-solid border-[#563B00] rounded-full',
        track: 'h-[14px] my-0 border-s-[#FFEA05] border-x-[7px]',
      }}
      renderThumb={(props) => (
        <div
          {...props}
          className="group top-1/2 cursor-grab rounded-full border border-solid border-[#563B00] bg-[#FFEA05] p-[8px] shadow-medium data-[dragging=true]:cursor-grabbing"
        />
      )}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={value}
      onChange={handleValueChange}
    />
  )
}
