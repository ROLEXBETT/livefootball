export default function Contact() {
  return (
    <main className="info-page">
      <section className="info-hero">
        <span className="info-badge">📬 Contact</span>
        <h1>Contact LivePulse</h1>
        <p>
          Have a question, suggestion, or issue? You can contact the LivePulse
          team using the details below.
        </p>
      </section>

      <section className="info-card">
        <h2>Email</h2>
        <p>
          <a className="contact-link" href="mailto:livepulsecare@gmail.com">
            livepulsecare@gmail.com
          </a>
        </p>
      </section>

      <section className="info-card">
        <h2>Support</h2>
        <p>
          For app support, football data issues, advertising questions, or
          general feedback, send us an email and we will respond as soon as
          possible.
        </p>
      </section>
    </main>
  );
}