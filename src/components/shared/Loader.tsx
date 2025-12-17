import { HTMLAttributes } from "react"

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
}
const Loader = ({
  width = 24,
  height = 24,
  ...props
}:LoaderProps) => {
  return (
    <div {...props} className="flex justify-center w-full">
        <img src="/assets/svg/tube-spinner.svg" alt="loader" width={width} height={height}/>
    </div>
  )
}

export default Loader