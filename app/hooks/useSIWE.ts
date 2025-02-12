import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { useGlobalContext } from '../context/GlobalContext';

const useSIWE = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { isSignedIn, setIsSignedIn } = useGlobalContext();
  const [status, setStatus] = useState<string>('');

  useEffect(()=>{
    if(isSignedIn){
      setStatus('Signed in');
    }
  },[isSignedIn, isConnected])

  const doSIWE = useCallback(async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
    }
    if (!address) return;

    try {
      // Request nonce from backend
      const nonceRes = await fetch('/api/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address }),
      });
      const { nonce } = await nonceRes.json();

      // Use Wagmi's signMessage hook (which utilizes viem under the hood) to sign the nonce
      const signature = await signMessageAsync({ message: nonce });

      // Verify signature on backend
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address, signature }),
      });
      const verifyData = await verifyRes.json();
      setIsSignedIn(verifyData.success);
    } catch (error) {
      console.error(error);
      setStatus('Error signing in');
    }
  }, [address, isConnected, connect, connectors, signMessageAsync, setIsSignedIn]);

  return { doSIWE, status };
};

export default useSIWE;