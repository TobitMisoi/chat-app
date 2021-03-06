/* eslint-disable react/prop-types */
import React from 'react'

// Local imports
import styles from './styles.module.scss'

type Props = {
  onClick: () => void
}

const OnBoard: React.FC<Props> = (props) => {
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.wrapper}>
        <img src='https://unsplash.it/110' alt='logo' className={styles.logo} />
        <h1 className={styles.logo}>Hello World!</h1>
        <p className={styles.description}>
          I really appreciate that you take time to have a look to my work. This
          app is an instant messaging project that offer the possibility to
          create and join channels and start a conversation.
        </p>
        <ul className={styles.list}>
          <li>⭐️ Use the &quot;menu&quot; icon on top (Mobile).</li>
          <li>⭐️ Click on any channel you want to join.</li>
          <li>⭐️ Create a channel with the &quot;+&quot; icon.</li>
          <li>⭐️ Send messages with the text input.</li>
          <li>⭐️ Browse channels with the search input.</li>
          <li>⭐️ Report a bug with the &quot;bug&quot; icon.</li>
          <li>⭐️ Click on your profile to edit.</li>
          <li>⭐️ Use the &quot;exit&quot; icon to logout.</li>
        </ul>
      </div>
    </div>
  )
}

export default OnBoard
