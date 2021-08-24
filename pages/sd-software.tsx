import styles from '../styles/pages/sd-software.module.scss';

export default function AllProjects() {
  return (
    <>
      <h1 className={styles.title}>📺 SD Software 💻</h1>

      <div className={styles.container}>
        <section>
          <h4>Hire me! 👋</h4>
          <p>
            I am currently freelancing! Specialised in full stack web-development and backend
            architecture. Eager to learn and up for a challenge!
          </p>
          <h4 className={styles.interested}>Interested?</h4>
          <p>
            Send me an e-mail! <a href="mailto:sivanduijn@gmail.com">sivanduijn@gmail.com</a>
          </p>
        </section>
      </div>
    </>
  );
}
