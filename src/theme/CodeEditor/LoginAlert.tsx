import * as React from "react";
import styles from "./LoginAlert.module.scss";
import Link from '@docusaurus/Link';
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/hooks";

const LoginAlert = observer(() => {
  const msalStore = useStore("msalStore");
  if (msalStore.loggedIn) {
    return null;
  }
  return (
    <div className={styles.noLoginAlert}>
      <span className="badge badge--danger">⚠️ Nicht Eingeloggt</span> Speichern
      nur mit GBSL-Login möglich. <Link to="/login">Login</Link>
    </div>
  );
});

export default LoginAlert;
