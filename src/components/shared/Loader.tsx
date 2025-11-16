
interface LoaderProps {
  width?: number
  height?: number
}
const Loader = ({
  width = 24,
  
  height = 24
}:LoaderProps) => {
  return (
    <div className="flex justify-center w-full">
        <img src="/assets/svg/tube-spinner.svg" alt="loader" width={width} height={height}/>
    </div>
  )
}

export default Loader