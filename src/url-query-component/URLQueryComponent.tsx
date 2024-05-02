import { useCallback, useState } from 'react'
import styles from './URLQueryComponent.module.css'
import axios from 'axios'

const HttpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface FetchResult {
  result?: object
  errorMessage?: string
}

export function URLQueryComponent() {
  const [url, setUrl] = useState('')
  const [fetchResult, setFetchResult] = useState<Record<string, FetchResult> | null>(null)
  const [fetchResultExpanded, setFetchResultExpanded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestPending, setRequestPending] = useState(false)

  const handleCheckButtonClick = useCallback(async () => {
    if (!url) {
      setErrorMessage('Please type an URL in the text field.')
      return
    }

    setErrorMessage('')
    setFetchResult(null)
    setFetchResultExpanded(false)
    setRequestPending(true)

    const newFetchResult: Record<string, FetchResult> = {}
    let success = false

    for (const method of HttpMethods) {
      try {
        const { data } = await axios({ method, url })

        newFetchResult[method] = { result: data }
        success = true
      } catch (error: any) {
        newFetchResult[method] = { errorMessage: error?.message.toString() || error.toString() || 'Unspecified error' }
      }
    }

    if (success) {
      setFetchResult(newFetchResult)
    } else {
      setErrorMessage(`URL could not be fetched on any HTTP method (tried ${HttpMethods.join(', ')}).`)
    }

    setRequestPending(false)
  }, [url])

  return (
    <div className={styles.container}>
      <div>
        <input className={styles.input} type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className={styles.button} type="button" disabled={requestPending} onClick={handleCheckButtonClick}>
          Check URL
        </button>
      </div>

      {requestPending && <div className={styles.topMargin}>Checking URL with different HTTP methods...</div>}

      {
        <div className={styles.topMargin}>
          {fetchResult && (
            <>
              <div>URL fetched successfully on at least one HTTP method!</div>

              <div className={styles.topMargin}>
                <button className={styles.button} onClick={() => setFetchResultExpanded(!fetchResultExpanded)}>
                  {fetchResultExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {Object.keys(fetchResult).map((method) => (
                <div className={styles.topMargin} key={method}>
                  {fetchResult[method].result ? (
                    <>
                      <div className={styles.success}>{method}:</div>
                      <pre>
                        {fetchResultExpanded
                          ? JSON.stringify(fetchResult[method].result, null, 2)
                          : JSON.stringify(fetchResult[method].result, null, 2).substring(0, 100) + '...'}
                      </pre>
                    </>
                  ) : (
                    <>
                      <div className={styles.error}>{method} (Error):</div>
                      <pre>{fetchResult[method].errorMessage}</pre>
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>
      }
    </div>
  )
}
