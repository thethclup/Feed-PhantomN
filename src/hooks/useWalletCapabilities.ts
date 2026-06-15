import { useCapabilities } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { useMemo } from 'react'

export function useWalletCapabilities(chainId: number = base.id) {
  const { data: capabilities } = useCapabilities()

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[chainId]?.atomic
    return atomic?.status === 'ready' || atomic?.status === 'supported'
  }, [capabilities, chainId])

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[chainId]?.paymasterService?.supported === true
  }, [capabilities, chainId])

  return { supportsBatching, supportsPaymaster }
}
