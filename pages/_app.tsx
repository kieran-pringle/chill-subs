import React, { useRef, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { UserProvider } from '@auth0/nextjs-auth0';
import '../styles/globals.css'

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const retainedComponents = useRef({})
  const isRetainableRoute = router.pathname.includes('/browse');

  // Add Component to retainedComponents if we haven't got it already
  if (isRetainableRoute && !retainedComponents.current[router.pathname]) {
    const MemoComponent = memo(Component)
    retainedComponents.current[router.pathname] = {
      component: <MemoComponent {...pageProps} />,
      scrollPos: 0
    }
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = () => {
    if (isRetainableRoute) {
      retainedComponents.current[router.pathname].scrollPos = window.scrollY
    }
  }

  // Save scroll position - requires an up-to-date router.pathname
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.pathname])

  // const handleRouteChange = (_: any, { shallow }: { shallow: boolean }) => {
  //   if (shallow) {
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   router.events.on("routeChangeComplete", handleRouteChange);
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.query]);

  // Scroll to the saved position when we load a retained component
  useEffect(() => {
    if (isRetainableRoute) {
      window.scrollTo(0, retainedComponents.current[router.pathname].scrollPos)
    }
  }, [Component, pageProps])

  return (
    <UserProvider>
      <div>
        <div style={{ display: isRetainableRoute ? 'block' : 'none' }}>
          {Object.entries(retainedComponents.current).map(([path, c]: any) => (
            <div
              key={path}
              style={{ display: router.pathname === path ? 'block' : 'none' }}
            >
              {c.component}
            </div>
          ))}
        </div>
        {!isRetainableRoute && <Component {...pageProps} />}
      </div>
    </UserProvider>
    
  )
}

export default App