import React from 'react'
import CustomButton from '../customButton'

// Local imports
import styles from './styles.module.scss'

type Props = {
  onAccept: () => void
}

const Cookie: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.box}>
          <div className={styles.title}>Are you hungry?</div>
          <div className={styles.action}>
            <CustomButton
              isPurple
              small
              title='Accept cookies'
              onClick={props.onAccept}
            />
            <a
              href='https://ec.europa.eu/info/cookies_en'
              target='_blank'
              className={styles.info}
              rel='noreferrer'
            >
              More information
            </a>
          </div>
        </div>
      )}
      <img
        src='https://unsplash.it/120'
        className={styles.cookie}
        onClick={() => setOpen((prev) => !prev)}
        alt=''
      />
    </div>
  )
}

export default Cookie
