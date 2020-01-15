import { useEffect } from 'react'

const useSnapcallScript = btnBid => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://snap.snapcall.io/snapapp.min.js'
    script.async = true
    script.setAttribute('noWidget', 'true')
    script.setAttribute('btn-bid', btnBid)

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [btnBid])
}

export default useSnapcallScript
