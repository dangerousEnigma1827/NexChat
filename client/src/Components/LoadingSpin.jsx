import { Oval, TailSpin } from 'react-loader-spinner'

export default function LoadingSpin() {
  return (
    <TailSpin
      height={16}
      width={16}
      color="#ffffff"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#4fa94d"
      strokeWidth={4}
      strokeWidthSecondary={2}
    />
  )
}