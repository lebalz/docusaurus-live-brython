import * as React from 'react';
import styles from './styles.module.css';

export default function Result({ logMessages }) {
  return (
    <div className={styles.brythonOut}>
      {
        logMessages.length > 0 && (
          <pre>
            {logMessages.map((msg, idx) => {
              return (
                <code
                  key={idx}
                  style={{
                    color: msg.type === 'stderr' ? 'var(--ifm-color-danger-darker)' : undefined
                  }}
                >
                  {msg.msg}
                </code>)
            })}
          </pre>
        )
      }
    </div>
  )
}