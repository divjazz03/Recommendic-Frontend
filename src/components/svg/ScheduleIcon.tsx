import { SVGProps } from '@/types'
import React from 'react'

const ScheduleIcon: React.FC<SVGProps> = ({className}) => {
  return (
    <svg viewBox="0 0 1024 1024" className={className}  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M394.88 844.16a349.44 349.44 0 0 1-117.44-69.76 32 32 0 0 0-42.56 47.68 413.76 413.76 0 0 0 138.88 82.24 32 32 0 0 0 10.56 1.92 32 32 0 0 0 10.56-62.08zM489.28 873.28A32 32 0 0 0 480 896a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56 36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 28.8 28.8 0 0 0 17.28-17.28A32 32 0 0 0 544 896a32 32 0 0 0-54.72-22.72z" fill="#231815" /><path d="M512 32v64A416 416 0 0 0 151.68 720a32 32 0 1 0 55.36-32A352 352 0 0 1 512 160v64a288 288 0 0 1 288 288h64a352 352 0 0 1-234.56 332.16 32 32 0 1 0 21.44 60.16A416 416 0 0 0 928 512h64A480 480 0 0 0 512 32z"/></svg>
  )
}

export default ScheduleIcon