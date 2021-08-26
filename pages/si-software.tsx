import styles from '../styles/pages/sd-software.module.scss';
import achmea from '../public/images/si-software-logos/achmea.png';
import s4s from '../public/images/si-software-logos/search4solutions.png';
import graphpolaris from '../public/images/si-software-logos/graphpolaris.png';

export default function AllProjects() {
  return (
    <>
      <h1 className={styles.title}>📺 SiSoftware 💻</h1>

      <div className={styles.container}>
        <section>
          <h3>Hire me! 👋</h3>
          <p>
            I am currently freelancing! Specialised in full stack web-development and backend
            architecture. Eager to learn and up for a challenge!
          </p>
          <h4 className={styles.interested}>Interested?</h4>
          <p>
            Send me an e-mail! <a href="mailto:sivanduijn@gmail.com">sivanduijn@gmail.com</a>
          </p>
        </section>

        <section>
          <ul>
            <h3>My work experience:</h3>
            <li>
              <h4>
                <a
                  href="https://graphpolaris.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#ff7800' }}
                >
                  GraphPolaris
                </a>{' '}
                - Frontend lead programmer, <i>Utrecht 2021</i>
              </h4>
              <p>
                During the Utrecht University Software Project I worked in a scrum team with 11
                members as the lead frontend developer. I also realized the{' '}
                <a target="_blank" rel="noreferrer" href="https://graphpolaris.com">
                  GraphPolaris
                </a>{' '}
                landing page.
              </p>
            </li>
            <li>
              <h4>
                <a
                  href="https://www.achmeapensioenservices.nl/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#cc0000' }}
                >
                  Achmea Pensioenservices
                </a>{' '}
                - Feature Toggles, <i>Zeist 2019</i>
              </h4>
              <p>
                Designing and imlementing a{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Feature_toggle"
                  target="_blank"
                  rel="noreferrer"
                >
                  Feature Toggles
                </a>{' '}
                backend architecture, which was written in C#. As well as the frontend UI.
              </p>
            </li>
            <li>
              <h4>
                <a
                  href="https://search4solutions.nl"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2abb4c' }}
                >
                  Search4Solutions
                </a>{' '}
                - Internship, <i>Utrecht 2019</i>
              </h4>
              <p>Setting up chatbot cloud platform with Azure DevOps, C# and Javascript.</p>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
